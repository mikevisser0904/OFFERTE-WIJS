#!/usr/bin/env node
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  detectPhpMyAdmin,
  isSiteNoisePage,
  panelProbeToFinding,
  looksLikePhpMyAdminBody,
} from "./admin-panel-detect.mjs";

const WP_404 = `<!DOCTYPE html><html><head><title>Pagina niet gevonden</title></head><body>
<div class="wp-content">phpmyadmin link in footer menu</div></body></html>`.repeat(50);

const REAL_PMA = `<html><head><title>phpMyAdmin</title></head><body>
<form id="loginform"><input name="pma_username"><input name="pma_password" type="password">
Welcome to phpMyAdmin</form></body></html>`;

describe("admin-panel-detect", () => {
  it("reject WordPress 404 noise", () => {
    assert.equal(isSiteNoisePage(WP_404, 200), true);
    assert.equal(detectPhpMyAdmin(WP_404), null);
    assert.equal(looksLikePhpMyAdminBody(WP_404, 200), false);
  });

  it("accept real login form", () => {
    const d = detectPhpMyAdmin(REAL_PMA);
    assert.equal(d?.confidence, "high");
    assert.equal(d?.kind, "login");
    const f = panelProbeToFinding({ path: "/phpmyadmin/", label: "phpMyAdmin" }, {
      status: 200,
      body: REAL_PMA,
      url: "https://example.com/phpmyadmin/",
    });
    assert.ok(f?.verified);
    assert.equal(f?.panelConfidence, "high");
  });
});