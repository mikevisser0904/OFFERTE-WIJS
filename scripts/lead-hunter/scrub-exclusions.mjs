#!/usr/bin/env node
/**
 * Verwijder uitgesloten hosts uit lek-exports + zet echte-klanten op veilig (geen schrik-tekst).
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = process.cwd();

function load(path, fb) {
  if (!existsSync(path)) return fb;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fb;
  }
}

function hostOf(url) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function main() {
  const excl = load(join(root, "data/scan-uitsluitingen.json"), { hosts: [] });
  const blocked = new Set((excl.hosts || []).map((h) => h.host.toLowerCase()));

  for (const file of ["data/klanten-lek-rapport.json", "data/klanten-database-export.json"]) {
    const path = join(root, file);
    const data = load(path, null);
    if (!data) continue;
    if (data.klanten) {
      data.klanten = data.klanten.filter((k) => !blocked.has(hostOf(k.url)));
      data.metLek = data.klanten.filter((k) => k.heeftLek).length;
      data.gescand = data.klanten.length;
    }
    if (data.rijen) {
      data.rijen = data.rijen.filter((r) => !blocked.has(hostOf(r.url)));
      data.totaalMetLek = data.rijen.length;
    }
    data.updatedAt = new Date().toISOString();
    writeFileSync(path, JSON.stringify(data, null, 2));
    copyFileSync(path, join(root, "public", file.replace("data/", "")));
  }

  const echtePath = join(root, "data/echte-klanten.json");
  const echte = load(echtePath, { klanten: [] });
  let patched = 0;
  for (const k of echte.klanten || []) {
    if (!blocked.has(hostOf(k.url))) continue;
    const ex = (excl.hosts || []).find((h) => h.host === hostOf(k.url));
    k.uitgesloten = true;
    k.uitgeslotenReden = ex?.reden || "false positive";
    k.probleem = "Geen actief lek (scan gecorrigeerd)";
    k.aanbod = "Alleen op verzoek — geen veiligheidsclaim";
    k.heeftScan = false;
    k.bewijsUrl = null;
    k.adminProof = null;
    k.databaseProfiel = null;
    k.schrikRegels = [];
    k.verkoopBericht = null;
    k.verkoopKort = null;
    k.whatsappSchrik = null;
    k.scanToestemming = null;
    k.consentDeep = null;
    k.herstelBericht = `Beste ${k.bedrijf},\n\nMike van DoekoeWijs. U gaf toestemming voor een check — dank daarvoor. Na handmatige controle blijkt: de eerdere melding over een open database-beheer (phpMyAdmin) op uw site was onjuist. Het betrof een fout in onze automatische scan (WordPress-pagina, geen database).\n\nExcuses voor de zorg en de tijd. Wij hebben niets ingelogd en geen gegevens uit uw database gehaald. Als u wilt, stuur ik u kort schriftelijk wat wij wél en niet hebben gedaan.\n\nVriendelijke groet,\nMike`;
    patched++;
  }
  echte.generatedAt = new Date().toISOString();
  writeFileSync(echtePath, JSON.stringify(echte, null, 2));
  copyFileSync(echtePath, join(root, "public/echte-klanten.json"));

  const consentPath = join(root, "data/scan-toestemming.json");
  const consent = load(consentPath, { entries: [] });
  for (const e of consent.entries || []) {
    if (blocked.has(hostOf(e.siteUrl))) {
      e.status = "revoked";
      e.revokedReden = "false positive scan — relatie herstellen";
    }
  }
  consent.updatedAt = new Date().toISOString();
  writeFileSync(consentPath, JSON.stringify(consent, null, 2));

  console.log(`Uitsluitingen: ${blocked.size} host(s), ${patched} klanten in echte-klanten opgeschoond`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}