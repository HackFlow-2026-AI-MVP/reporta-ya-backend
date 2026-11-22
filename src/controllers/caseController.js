import { createCase, getCaseById, getCaseEvidences } from '../models/caseModel.js';

export async function createCaseHandler(req, res) {
  try {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const newCase = await createCase(title.trim());
    res.status(201).json(newCase);
  } catch (err) {
    console.error('createCase error:', err);
    res.status(500).json({ error: 'No se pudo crear el caso' });
  }
}

export async function getCaseHandler(req, res) {
  try {
    const { id } = req.params;
    const caseData = await getCaseById(id);
    if (!caseData) {
      return res.status(404).json({ error: 'Caso no encontrado' });
    }
    const evidences = await getCaseEvidences(id);
    res.json({ ...caseData, evidences });
  } catch (err) {
    console.error('getCase error:', err);
    res.status(500).json({ error: 'No se pudo obtener el caso' });
  }
}
