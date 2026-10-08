const evidenceLink = (subject: string) => `#media-sp-mzigo-26e-${subject}-2026-10-06`;

/** October evidence continues the existing archive; no separate gallery or lifecycle. */
export function MzigoExportEvidence() {
  return <section className="section shell mzigo-customization" id="export-evidence">
    <div className="section-heading"><div><p className="eyebrow">October 6–7, 2026 · Factory to fleet</p><h2>Identity, equipment<br />and export preparation.</h2></div><p>October 6 photograph timestamps establish the packing sequence. The October 7 supplier statement places the machine at a Qingdao Port warehouse; the photographs alone do not establish that location.</p></div>
    <div id="manufacturer-identity" className="mzigo-verification"><h3>Manufacturer identity</h3><dl>
      <div><dt>Fleet identity</dt><dd>SP-MZIGO-26E · Founders Edition</dd></div>
      <div><dt>Manufacturer / OEM model</dt><dd>KYLIN · K600<br /><small>Shandong Kylin Heavy Industry Machinery Co., Ltd., as recorded in the project and photographed product certificate.</small></dd></div>
      <div><dt>Manufacturer serial number</dt><dd>QLUP202609010001</dd></div>
      <div><dt>Plate rated load</dt><dd>750 kg</dd></div>
      <div><dt>Plate vehicle weight</dt><dd>320 kg</dd></div>
      <div><dt>Production year</dt><dd>2026</dd></div>
    </dl><p><a href={evidenceLink('manufacturer-nameplate')}>Inspect the original manufacturer plate photograph →</a></p>
    <p><strong>Rating evidence evolved.</strong> Earlier supplier-stated configuration recorded 500 kg / approximately 1,100 lb. The physical unit plate now records 750 kg rated load and is the strongest unit-specific rating evidence currently available. The reason for the difference is not documented. This is not a field load test or operating clearance; receipt and commissioning remain pending.</p></div>
    <div id="included-equipment" className="mzigo-verification"><h3>Included equipment documented for packing</h3><dl>
      <div><dt>Remote and instructions</dt><dd>HotRC handheld controller, printed control diagram and loose cylindrical batteries.<br /><a href={evidenceLink('hotrc-remote-controller')}>Remote photograph</a> · <a href={evidenceLink('controller-batteries-documentation')}>Instructions and batteries</a></dd></div>
      <div><dt>Charging equipment</dt><dd>Charger equipment and two U.S.-style three-prong cords photographed. Plug shape does not verify voltage, certification or charging performance.<br /><a href={evidenceLink('charger-us-style-plugs')}>Charging equipment photograph</a></dd></div>
      <div><dt>Toolkit and paperwork</dt><dd>Yellow case, metal joint/shaft component, labeled bottle, product certificate and maintenance QR material. Exact spare-part identity and bottle contents remain unconfirmed.<br /><a href={evidenceLink('toolkit-maintenance-qr')}>Open toolkit</a> · <a href={evidenceLink('product-certificate')}>Certificate photograph</a></dd></div>
      <div><dt>Spare wheel and loadout</dt><dd>Spare wheel/tire, tool case and two closed boxes in the dump bed. Box contents and final delivered inventory require receipt verification.<br /><a href={evidenceLink('qc-pass-spare-wheel-loadout')}>Packed accessory loadout</a></dd></div>
    </dl></div>
    <div id="packing-crating" className="mzigo-verification"><h3>QC marking, packing and crating</h3><p>A visible QC PASS sticker and supplied product certificate document factory markings and paperwork, not an independent inspection, safety certification or completed functional test.</p><ol>
      <li>Nameplate, charging equipment, controller, paperwork and toolkit photographed.</li>
      <li>Machine moved onto an export skid; wheel blocking and crate-wall assembly photographed.</li>
      <li>Spare wheel and packaged accessories placed in the dump bed.</li>
      <li>Wooden crate closed at the photographed 15:26 timestamp on October 6. That original remains private because its warehouse address/contact label is visible.</li>
      <li>Supplier reported Qingdao warehouse staging on October 7; awaiting freight booking and sailing evidence.</li>
    </ol><p><a href="#mzigo-archive-export-journey">Explore the dated photographs and skid videos in Export Journey →</a></p><p>Container, bill of lading, vessel, voyage, departure, ETA, destination port, customs and last-mile carrier remain unconfirmed. No sea departure or delivery is inferred from a crate or warehouse report.</p></div>
  </section>;
}
