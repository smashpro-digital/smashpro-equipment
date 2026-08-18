-- SP Fleet Equipment Passport v1 (MySQL 8+, additive and idempotent)
-- Private tables must never be exposed through the public catalog database user.
CREATE TABLE IF NOT EXISTS equipment_assets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, passport_id VARCHAR(64) NOT NULL UNIQUE COMMENT 'PERMANENT AND IMMUTABLE', fleet_id VARCHAR(64) NOT NULL UNIQUE, model VARCHAR(120) NOT NULL,
  edition VARCHAR(120) NOT NULL, finish VARCHAR(180) NULL, asset_class VARCHAR(120) NOT NULL, manufacturer VARCHAR(160) NULL,
  serial_number VARCHAR(190) NULL, model_year SMALLINT UNSIGNED NULL, fleet_entry_date DATE NULL, operating_hours DECIMAL(12,2) NULL,
  current_status VARCHAR(60) NOT NULL DEFAULT 'fleet-build', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS equipment_factory_specifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, spec_group VARCHAR(120) NOT NULL,
  spec_name VARCHAR(160) NOT NULL, spec_value TEXT NOT NULL, source_reference VARCHAR(255) NULL, sort_order INT NOT NULL DEFAULT 0,
  public_display TINYINT(1) NOT NULL DEFAULT 1, UNIQUE KEY uq_equipment_spec (equipment_id,spec_name),
  CONSTRAINT fk_spec_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_factory_options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, name VARCHAR(180) NOT NULL,
  description TEXT NULL, factory_cost DECIMAL(12,2) NULL COMMENT 'PRIVATE', public_display TINYINT(1) NOT NULL DEFAULT 0,
  installation_source VARCHAR(30) NOT NULL DEFAULT 'factory', installed_at DATE NULL,
  CONSTRAINT fk_factory_option_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_upgrades (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, upgrade_name VARCHAR(180) NOT NULL,
  category VARCHAR(120) NOT NULL, description TEXT NULL, install_date DATE NULL, installed_by VARCHAR(180) NULL, vendor VARCHAR(180) NULL,
  purchase_cost DECIMAL(12,2) NULL COMMENT 'PRIVATE', labor_cost DECIMAL(12,2) NULL COMMENT 'PRIVATE', total_cost DECIMAL(12,2) GENERATED ALWAYS AS (COALESCE(purchase_cost,0)+COALESCE(labor_cost,0)) STORED COMMENT 'PRIVATE',
  estimated_added_value DECIMAL(12,2) NULL, youtube_url VARCHAR(500) NULL, vendor_url VARCHAR(500) NULL, warranty TEXT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'installed', notes TEXT NULL, superseded_by_upgrade_id BIGINT UNSIGNED NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_upgrade_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_upgrade_tags (
  upgrade_id BIGINT UNSIGNED NOT NULL, tag VARCHAR(100) NOT NULL, PRIMARY KEY (upgrade_id,tag),
  CONSTRAINT fk_upgrade_tag FOREIGN KEY (upgrade_id) REFERENCES equipment_upgrades(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_packages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, package_key VARCHAR(80) NOT NULL UNIQUE, package_name VARCHAR(160) NOT NULL, description TEXT NULL, active TINYINT(1) NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS equipment_package_rules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, package_id BIGINT UNSIGNED NOT NULL, required_tag VARCHAR(100) NOT NULL, rule_group SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_package_rule (package_id,required_tag,rule_group), CONSTRAINT fk_package_rule FOREIGN KEY (package_id) REFERENCES equipment_packages(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, name VARCHAR(180) NOT NULL, category VARCHAR(120) NOT NULL,
  status VARCHAR(40) NOT NULL, added_at DATE NULL, description TEXT NULL, public_display TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_attachment_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, upgrade_id BIGINT UNSIGNED NULL, title VARCHAR(200) NOT NULL,
  media_type VARCHAR(30) NOT NULL, media_url VARCHAR(500) NOT NULL, published_at DATETIME NULL, description TEXT NULL, public_display TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_media_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_upgrade FOREIGN KEY (upgrade_id) REFERENCES equipment_upgrades(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS equipment_documents (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, upgrade_id BIGINT UNSIGNED NULL, title VARCHAR(200) NOT NULL,
  document_type VARCHAR(40) NOT NULL, storage_key VARCHAR(500) NOT NULL, mime_type VARCHAR(100) NULL, public_display TINYINT(1) NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_document_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_document_upgrade FOREIGN KEY (upgrade_id) REFERENCES equipment_upgrades(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS equipment_service_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, performed_at DATETIME NOT NULL, service_type VARCHAR(120) NOT NULL,
  summary TEXT NOT NULL, provider VARCHAR(180) NULL, operating_hours DECIMAL(12,2) NULL, status VARCHAR(40) NOT NULL DEFAULT 'completed', public_display TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_service_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_value_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, valued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  market_value DECIMAL(12,2) NOT NULL, factory_option_value DECIMAL(12,2) NOT NULL DEFAULT 0, upgrade_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  maintenance_multiplier DECIMAL(6,4) NOT NULL DEFAULT 1, documentation_multiplier DECIMAL(6,4) NOT NULL DEFAULT 1,
  edition_premium DECIMAL(12,2) NOT NULL DEFAULT 0, depreciation_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_replacement_cost DECIMAL(12,2) NULL, estimated_market_value DECIMAL(12,2) NULL, purchase_price_snapshot DECIMAL(12,2) NULL,
  total_upgrade_investment DECIMAL(12,2) NULL, rental_revenue_generated DECIMAL(12,2) NULL, maintenance_investment DECIMAL(12,2) NULL,
  net_asset_roi DECIMAL(12,2) NULL, estimated_fleet_value DECIMAL(12,2) NOT NULL, methodology_version VARCHAR(40) NOT NULL, public_display TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_value_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_purchase_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, purchase_price_actual DECIMAL(12,2) NULL,
  shipping_actual DECIMAL(12,2) NULL, tax_actual DECIMAL(12,2) NULL, customs_actual DECIMAL(12,2) NULL, purchased_at DATE NULL,
  seller VARCHAR(180) NULL, notes TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_purchase_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, upgrade_id BIGINT UNSIGNED NULL,
  receipt_type VARCHAR(40) NOT NULL, vendor VARCHAR(180) NULL, amount DECIMAL(12,2) NULL, purchased_at DATE NULL, storage_key VARCHAR(500) NOT NULL,
  sha256 CHAR(64) NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_receipt_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_receipt_upgrade FOREIGN KEY (upgrade_id) REFERENCES equipment_upgrades(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS equipment_timelines (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, event_type VARCHAR(50) NOT NULL, occurred_at DATETIME NULL,
  title VARCHAR(200) NOT NULL, detail TEXT NULL, source_table VARCHAR(80) NULL, source_id BIGINT UNSIGNED NULL, public_display TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_timeline_equipment_date (equipment_id,occurred_at),
  CONSTRAINT fk_timeline_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_milestones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, milestone_key VARCHAR(80) NOT NULL,
  achieved_at DATETIME NOT NULL, title VARCHAR(180) NOT NULL, detail TEXT NULL, timeline_id BIGINT UNSIGNED NULL, public_display TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_equipment_milestone (equipment_id,milestone_key), CONSTRAINT fk_milestone_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE,
  CONSTRAINT fk_milestone_timeline FOREIGN KEY (timeline_id) REFERENCES equipment_timelines(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS equipment_revenue_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, rental_reference VARCHAR(120) NULL,
  earned_at DATETIME NOT NULL, gross_revenue DECIMAL(12,2) NOT NULL, fees DECIMAL(12,2) NOT NULL DEFAULT 0, net_revenue DECIMAL(12,2) NOT NULL,
  notes TEXT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_revenue_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS equipment_ownership_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, equipment_id BIGINT UNSIGNED NOT NULL, owner_name VARCHAR(200) NOT NULL,
  acquired_at DATE NULL, transferred_at DATE NULL, acquisition_type VARCHAR(60) NULL, notes TEXT NULL, public_display TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_ownership_equipment FOREIGN KEY (equipment_id) REFERENCES equipment_assets(id) ON DELETE CASCADE
);

INSERT IGNORE INTO equipment_packages (package_key,package_name,description) VALUES
('command','Command Package','Connected command, charging, and telemetry equipment.'),('night-ops','Night Ops Package','Documented lighting configuration for low-light work.'),
('recovery','Recovery Package','Integrated recovery and towing equipment.'),('media','Media Package','On-machine production and field connectivity equipment.');
INSERT IGNORE INTO equipment_package_rules (package_id,required_tag)
SELECT id,'gps' FROM equipment_packages WHERE package_key='command' UNION ALL SELECT id,'solar' FROM equipment_packages WHERE package_key='command' UNION ALL SELECT id,'fleet telemetry' FROM equipment_packages WHERE package_key='command'
UNION ALL SELECT id,'rock lights' FROM equipment_packages WHERE package_key='night-ops' UNION ALL SELECT id,'light bar' FROM equipment_packages WHERE package_key='night-ops' UNION ALL SELECT id,'work lights' FROM equipment_packages WHERE package_key='night-ops'
UNION ALL SELECT id,'winch' FROM equipment_packages WHERE package_key='recovery' UNION ALL SELECT id,'recovery points' FROM equipment_packages WHERE package_key='recovery' UNION ALL SELECT id,'receiver hitch' FROM equipment_packages WHERE package_key='recovery'
UNION ALL SELECT id,'camera mounts' FROM equipment_packages WHERE package_key='media' UNION ALL SELECT id,'power station' FROM equipment_packages WHERE package_key='media' UNION ALL SELECT id,'starlink' FROM equipment_packages WHERE package_key='media' UNION ALL SELECT id,'creator lighting' FROM equipment_packages WHERE package_key='media';

-- Preserve the birth certificate and upgrade ledger. Correct records by appending
-- a superseding record/status event, never by editing identity or deleting history.
DROP TRIGGER IF EXISTS equipment_assets_passport_id_immutable;
CREATE TRIGGER equipment_assets_passport_id_immutable BEFORE UPDATE ON equipment_assets FOR EACH ROW
  SET NEW.passport_id = OLD.passport_id;
DROP TRIGGER IF EXISTS equipment_assets_no_delete;
CREATE TRIGGER equipment_assets_no_delete BEFORE DELETE ON equipment_assets FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Equipment passports are permanent; transfer ownership or retire the asset.';
DROP TRIGGER IF EXISTS equipment_upgrades_no_delete;
CREATE TRIGGER equipment_upgrades_no_delete BEFORE DELETE ON equipment_upgrades FOR EACH ROW
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Upgrade ledger records are immutable; supersede or mark removed.';
