import { v4 as uuidv4 } from 'uuid';
import { query } from '../services/db.js';

export async function createCase(title) {
  const id = uuidv4();
  const caseNumber = `RY-${id.replaceAll('-', '').slice(0, 8).toUpperCase()}`;
  await query(
    'INSERT INTO `cases` (`id`, `case_number`, `title`) VALUES (?, ?, ?)',
    [id, caseNumber, title]
  );
  return getCaseById(id);
}

export async function getCaseById(id) {
  const { rows } = await query(
    'SELECT `id`, `case_number` AS `caseNumber`, `title`, `created_at` AS `createdAt` FROM `cases` WHERE `id` = ?',
    [id]
  );
  return rows[0] || null;
}

export async function getCaseEvidences(id) {
  const { rows } = await query(
    `SELECT e.`id`, e.`type_id` AS `typeId`, et.`name` AS `typeName`,
            e.`incident_date` AS `incidentDate`, e.`description`,
            e.`person_involved` AS `personInvolved`, e.`priority`,
            e.`file_name` AS `fileName`, e.`created_at` AS `createdAt`
     FROM `evidences` e JOIN `evidence_types` et ON e.`type_id` = et.`id`
     WHERE e.`case_id` = ? ORDER BY e.`incident_date` ASC, e.`created_at` ASC`,
    [id]
  );
  return rows;
}
