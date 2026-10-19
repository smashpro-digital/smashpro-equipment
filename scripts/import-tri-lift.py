"""Preserve local originals; never copy private bytes to public/ or Git."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
PARTNER = ROOT / 'partners' / 'tri-lift'
MAPPING = {
    '10-9-26 Smash Pro.pdf': ('rental-quote-20261009', 'quotes', 'Rental quote'),
    'Credit Application for Account Setup - NC.pdf': ('credit-application', 'forms', 'Credit application'),
    'Request for COI.pdf': ('coi-request', 'insurance', 'Certificate of insurance request'),
    'TRI-LIFT-INDUSTRIES-ACH---WIRE-IN-DETAIL-EQUIPMENT-PURCHASES-092424c.pdf':
        ('payment-reference', 'archive/payment-references', 'Payment reference'),
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify():
    records = json.loads((PARTNER / 'documents.json').read_text(encoding='utf-8'))
    for record in records:
        path = (PARTNER / record['path']).resolve()
        assert path.is_relative_to(PARTNER.resolve())
        assert digest(path) == record['sha256'], record['id']
        assert path.stat().st_size == record['bytes']
        if record['thumbnail']:
            assert (PARTNER / record['thumbnail']).is_file()
    print(f'Verified {len(records)} originals, hashes, sizes and available thumbnails.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?')
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    if args.verify:
        verify()
        return
    if not args.source:
        parser.error('source directory is required')
    source = Path(args.source).resolve(strict=True)
    if not source.is_dir() or source == PARTNER.resolve():
        raise ValueError('Use a separate source directory')
    manifest = PARTNER / 'documents.json'
    records = json.loads(manifest.read_text(encoding='utf-8')) if manifest.exists() else []
    files = sorted(p for p in source.rglob('*') if p.is_file())
    if not files:
        raise ValueError('Source contains no files')
    plans = []
    destinations = set()
    for original in files:
        sha = digest(original)
        record_id, folder, label = MAPPING.get(original.name,
            ('source-' + sha[:16], 'archive/private', 'Additional source document'))
        destination = PARTNER / folder / original.name
        if destination in destinations:
            raise ValueError(f'Duplicate filename requires a revision folder: {original.name}')
        destinations.add(destination)
        if destination.exists() and digest(destination) != sha:
            raise ValueError(f'Refusing to overwrite history: {original.name}')
        if any(r['id'] == record_id and r['sha256'] != sha for r in records):
            raise ValueError(f'Changed source requires a new revision ID: {original.name}')
        plans.append((original, destination, sha, record_id, label))
    renderer = shutil.which('pdftoppm')
    if any(p[0].suffix.lower() == '.pdf' for p in plans) and not renderer:
        raise RuntimeError('Install Poppler pdftoppm to generate document previews')
    for original, destination, sha, record_id, label in plans:
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not destination.exists():
            shutil.copy2(original, destination)
        assert digest(destination) == sha
        thumbnail = None
        if original.suffix.lower() == '.pdf':
            preview = PARTNER / 'previews' / record_id
            preview.parent.mkdir(exist_ok=True)
            thumbnail = f'previews/{record_id}.png'
            if not preview.with_suffix('.png').exists():
                subprocess.run([renderer, '-f', '1', '-singlefile', '-scale-to', '900',
                                '-png', str(destination), str(preview)], check=True)
        entry = {'id': record_id, 'title': label, 'filename': original.name,
                 'path': destination.relative_to(PARTNER).as_posix(),
                 'source_path': original.relative_to(source).as_posix(),
                 'sha256': sha, 'bytes': original.stat().st_size,
                 'thumbnail': thumbnail, 'visibility': 'private_original'}
        if not any(r['id'] == record_id for r in records):
            records.append(entry)
    manifest.write_text(json.dumps(records, indent=2) + '\n', encoding='utf-8')
    verify()
    print(f'Imported every source file ({len(files)}); source originals retained.')


if __name__ == '__main__':
    main()
