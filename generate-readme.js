import fs from "fs";
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta').locale('id');

const history = fs.readFileSync("history.txt", "utf-8").trim().split("\n");

const headerMatch = history[0].match(/#JumlahShowJKT48\s+(\d{4}-\d{2}-\d{2})/);
const tanggalRaw = headerMatch ? headerMatch[1] : "-";
const tanggalFormat = tanggalRaw !== "-" ? moment(tanggalRaw, "YYYY-MM-DD").format("dddd, D MMM YYYY") : "-";

const dataLines = history.slice(1).filter(line => /^\d+/.test(line));

const tableRows = dataLines.map((line, index) => {
    const match = line.match(/^(\d+)\s+([^\(]+?)(?:\s+\((\+\d+)\))?$/);
    if (!match) return null;

    const jumlahShow = match[1];
    const nama = match[2].trim();
    const penambahan = match[3] || "-";

    return `| ${index + 1} | ${nama} | ${jumlahShow} | ${penambahan} |`;
}).filter(Boolean);

const markdownTable = `# Jumlah Show JKT48
Update: ${tanggalFormat}  
© #JumlahShowJKT48 by @jehaes_ on X

| No | Member | Jumlah show | Penambahan |
|----|--------|-------------|------------|
${tableRows.join("\n")}
`;

fs.writeFileSync("README.md", markdownTable);
console.log("README.md berhasil diperbarui!");