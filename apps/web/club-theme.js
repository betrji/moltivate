export const clubTheme = `
:host {
  --panel: #0d0e10;
  --line: #25272c;
  --muted: #92959e;
  --up: #76e2a3;
  --down: #ff747f;
  color: #f1f2f4;
  color-scheme: dark;
}
button:focus-visible, input:focus-visible, select:focus-visible {
  outline: 2px solid #d7d9df;
  outline-offset: 4px;
}
.board {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: none;
}
.top { padding: 23px 24px; }
.identity { gap: 10px; }
.identity > svg { color: #8c909a; }
.identity strong { font-size: 21px; font-weight: 650; letter-spacing: -.6px; }
.demo {
  border-color: #34363d;
  color: #b0b3bc;
  background: #17181c;
  border-radius: 4px;
  padding: 5px 7px;
  font-size: 9px;
  letter-spacing: .06em;
}
.search {
  width: 254px;
  color: #92959e;
  background: #151619;
  border-color: #303239;
  border-radius: 7px;
  padding: 10px 12px;
}
.search:focus-within { border-color: #767b87; }
.search input { color: #f1f2f4; font-size: 12px; }
.search input::placeholder { color: #8c909a; }
.layout { display: block; }
.feed { display: none; }
.controls { padding: 18px 24px 16px; gap: 16px; }
.tabs { gap: 6px; }
.tab {
  border: 1px solid #303239;
  border-radius: 7px;
  background: transparent;
  color: #aeb1ba;
  padding: 8px 12px;
  font-size: 12px;
}
.tab:hover { background: #1d1f23; color: #f1f2f4; }
.tab[aria-pressed=true] { background: #25272c; border-color: #42454e; color: #f1f2f4; }
.selections { gap: 8px; }
.select-wrap:after { color: #9da1ab; right: 10px; top: 7px; }
.select-wrap select {
  background: #101114;
  border-color: #303239;
  border-radius: 7px;
  padding: 8px 29px 8px 11px;
  color: #c8cbd2;
  font-size: 11px;
}
.select-wrap select:hover { border-color: #5a5e68; }
.select-wrap option { background: #151619; color: #f1f2f4; }
.table-caption { color: var(--muted); padding: 0 24px 16px; font-size: 10px; }
.update-meta {
  padding: 0 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 9px 16px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
}
.update-meta .table-caption { padding: 0; margin: 0; }
thead { background: #101114; }
th { color: #9599a3; font-size: 10px; padding: 12px; letter-spacing: .055em; }
th:first-child { width: 55px; padding-left: 24px; }
th:nth-child(2) { width: 44%; }
th:nth-child(3) { width: 20%; }
th:last-child { padding-right: 24px; }
td { height: 93px; padding: 19px 12px; border-color: #202227; }
td:first-child { padding-left: 24px; color: #808590; font-size: 12px; }
td:last-child { padding-right: 24px; }
tr.club-row:hover { background: #17181c; }
.name-button { gap: 12px; }
.name-button:hover .team-name { color: #fff; }
.avatar {
  width: 39px;
  height: 39px;
  flex-basis: 39px;
  border: 2px solid #3c3e45;
  box-shadow: none;
  transform: none;
  font-size: 13px;
}
.team-name { color: #e9eaed; font-size: 14px; line-height: 1.35; font-weight: 600; letter-spacing: -.15px; }
.team-members { margin-top: 7px; color: #90949e; font-size: 10px; gap: 6px; }
.mini-avatar { background: #646973; color: #f1f2f4; border-color: var(--panel); }
.mini-avatar:nth-child(2) { background: #92959e; color: #101114; }
.moving { font-size: 9px; }
.up { color: var(--up); }
.down { color: var(--down); }
.progress-top { color: #d4d7dd; font-size: 12px; max-width: 112px; }
.progress-top > span > span { color: #858a95 !important; }
.progress-top > span:last-child { display: inline; color: #90949e; font-size: 10px; }
.track { background: #2a2d33; height: 3px; margin-top: 9px; max-width: 112px; }
.fill { background: #a4a9b3; }
.money {
  display: inline-block;
  font-size: 19px;
  font-weight: 550;
  line-height: 1.3;
  letter-spacing: -.65px;
  font-variant-numeric: tabular-nums;
}
.money rolling-amount { font: inherit; color: inherit; vertical-align: middle; }
.submoney { color: #90949e; font-size: 9px; gap: 9px; margin-top: 5px; }
.sparkline { display: block; width: 48px; height: 17px; opacity: .85; }
.board-bottom { color: #90949e; padding: 16px 24px; font-size: 10px; }
.reset { color: #b8bcc6; font-size: 10px; }
.reset:hover { color: #f1f2f4; }
.footnote { color: #8b909b; font-size: 10px; margin-top: 14px; }
.leader { color: #d8bd75 !important; }
.empty p { color: #a3a7b0; }
.empty button { background: #e2e4e9; color: #17181c; }
.status { color: #a3a7b0; }
.dot { background: var(--up); box-shadow: 0 0 0 3px #76e2a314; }
.dialog {
  background: #131417;
  color: #f1f2f4;
  border: 1px solid #383b43;
  border-radius: 14px;
  box-shadow: 0 24px 90px #0008;
}
.dialog::backdrop { background: #060709ce; }
.close { background: #282b31; color: #c9cdd5; }
.close:hover { background: #393d46; color: #fff; }
.dialog h3 { color: #f1f2f4; }
.motto { color: #aeb2bb; }
.dialog-meta { color: #aeb2bb; }
.dialog-stats { border-color: #34373f; }
.stat-label { color: #9a9faa; }
.member-count { color: #c9cdd5; }
.detail-note { color: #9a9faa; border-color: #34373f; }
.start-crew { background: #292c33; border-color: #474b56; color: #edf0f5; }
.start-crew:hover { background: #393d46; border-color: #737986; }
@media (max-width: 1000px) and (min-width: 761px) {
  .top { padding: 21px 22px; }
  .controls { padding: 17px 22px 15px; }
  .table-caption { padding-left: 22px; padding-right: 22px; }
  th:first-child, td:first-child { padding-left: 22px; }
  th:last-child, td:last-child { padding-right: 22px; }
}
@media (max-width: 760px) {
  .board { border-radius: 12px; }
  .top { padding: 18px 16px 16px; gap: 14px; }
  .identity strong { font-size: 19px; }
  .identity { gap: 9px; }
  .demo { font-size: 8px; padding: 5px 6px; }
  .search { width: 100%; }
  .controls { padding: 15px 13px 13px; gap: 10px; }
  .tabs { gap: 5px; }
  .tab { font-size: 10px; padding: 7px 9px; }
  .selections { gap: 5px; }
  .select-wrap select { font-size: 10px; padding: 7px 24px 7px 8px; }
  .select-wrap:after { top: 6px; right: 8px; }
  .table-caption { padding: 0 13px 13px; font-size: 9px; }
  .update-meta { padding: 0 13px 13px; gap: 8px; font-size: 9px; }
    th { padding: 11px 6px; font-size: 8px; letter-spacing: .03em; }
  th:first-child { width: 29px; padding-left: 13px; }
  th:nth-child(2) { width: 43%; }
  th:nth-child(3) { width: 18%; }
  th:last-child { padding-right: 13px; }
  td { height: 82px; padding: 16px 6px; }
  td:first-child { padding-left: 13px; font-size: 10px; }
  td:last-child { padding-right: 13px; }
  .name-button { gap: 8px; }
  .avatar { width: 30px; height: 30px; flex-basis: 30px; font-size: 10px; }
  .team-name { font-size: 12px; letter-spacing: -.1px; }
  .team-members { margin-top: 5px; font-size: 8px; gap: 4px; }
  .mini-avatar { width: 13px; height: 13px; font-size: 6px; }
  .moving { font-size: 8px; }
  .progress-top { font-size: 11px; }
  .progress-top > span:last-child { display: none; }
  .track { max-width: 62px; margin-top: 7px; }
  .money { font-size: 14px; letter-spacing: -.5px; }
  .submoney { font-size: 8px; margin-top: 5px; }
  .sparkline { display: none; }
  .board-bottom { padding: 14px 13px; gap: 8px; font-size: 9px; }
  .reset { font-size: 9px; }
  .footnote { font-size: 9px; padding: 0 6px; }
}
@media (max-width: 400px) {
  .identity strong { font-size: 18px; }
  .identity { gap: 7px; }
  .selections { width: 100%; }
  .select-wrap { flex: 1; }
  .select-wrap select { width: 100%; }
  .avatar { width: 25px; height: 25px; flex-basis: 25px; font-size: 8px; }
  .name-button { gap: 6px; }
  .team-name { font-size: 11px; }
  .team-members { gap: 3px; }
  .member-stack { display: none; }
  .money { font-size: 13px; letter-spacing: -.55px; }
  th:first-child { width: 27px; padding-left: 11px; }
  th:nth-child(2) { width: 43%; }
  th:nth-child(3) { width: 17%; }
  td:first-child { padding-left: 11px; }
  th:last-child, td:last-child { padding-right: 11px; }
}
@media (max-width: 340px) {
  .top { padding-left: 12px; padding-right: 12px; }
  .identity strong { font-size: 17px; }
  .identity > svg { width: 17px; }
  .identity .demo { font-size: 7px; }
  .money { font-size: 12px; letter-spacing: -.6px; }
  .team-name { font-size: 11px; }
  .avatar { width: 23px; height: 23px; flex-basis: 23px; }
  .name-button { gap: 5px; }
  .submoney { font-size: 7px; }
  .board-bottom { align-items: flex-start; }
}
`;
