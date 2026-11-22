import { v4 as uuidv4 } from 'uuid';
import { query } from '../services/db.js';

export async function getEvidenceTypes() {
  const { rows } = await query(
    `SELECT \`id\`, \`name\`, \`description\`, \`icon\` FROM \`evidence_types\` ORDER BY \`id\``
  );
  return rows;
}

export async function addEvidence(caseId, data) {
  const { typeId, incidentDate, description, personInvolved, priority, fileName } = data;
  const id = uuidv4();
  await query(
    `INSERT INTO \`evidences\` (\`id\`, \`case_id\`, \`type_id\`, \`incident_date\`, \`description\`, \`person_involved\`, \`priority\`, \`file_name\`, \`created_at\`)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [id, caseId, typeId, incidentDate, description, personInvolved || null, priority, fileName || null]
  );
  return { id, typeId, incidentDate, description, personInvolved: personInvolved || null, priority, fileName: fileName || null, createdAt: new Date().toISOString() };
}

export async function getEvidencesByCaseId(caseId) {
  const { rows } = await query(
    `SELECT e.\`id\`, e.\`type_id\` AS \`typeId\`, et.\`name\` AS \`typeName\`, e.\`incident_date\` AS \`incidentDate\`, e.\`description\`,
            e.\`person_involved\` AS \`personInvolved\`, e.\`priority\`, e.\`file_name\` AS \`fileName\`, e.\`created_at\` AS \`createdAt\`
     FROM \`evidences\` e
     JOIN \`evidence_types\` et ON e.\`type_id\` = et.\`id\`
     WHERE e.\`case_id\` = ?
     ORDER BY e.\`incident_date\` ASC, e.\`created_at\` ASC`,
    [caseId]
  );
  return rows;
}
