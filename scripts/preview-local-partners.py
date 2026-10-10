"""Loopback-only partner workspace; never use as a production server."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = (ROOT / 'partners').resolve()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = (ROOT / unquote(urlsplit(self.path).path).lstrip('/')).resolve()
        if not path.is_relative_to(ALLOWED) or any(p.startswith('.') for p in path.relative_to(ROOT).parts):
            self.send_error(404)
            return
        if self.headers.get('Host') not in {'127.0.0.1:4179', 'localhost:4179'}:
            self.send_error(403)
            return
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        super().end_headers()


if __name__ == '__main__':
    print('Local partner workspace: http://127.0.0.1:4179/partners/tri-lift/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4179), Handler).serve_forever()
