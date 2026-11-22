import { getEvidenceTypes } from '../models/evidenceModel.js';
import { addEvidence, getEvidencesByCaseId } from '../models/evidenceModel.js';
import { getCaseById } from '../models/caseModel.js';

export async function listEvidenceTypes(req, res) {
  try {
    const types = await getEvidenceTypes();
    res.json(types);
  } catch (err) {
    console.error('listEvidenceTypes error:', err);
    res.status(500).json({ error: 'No se pudo obtener el catálogo de tipos de evidencia' });
  }
}

export async function createEvidence(req, res) {
  try {
    const { id } = req.params;
    const caseExists = await getCaseById(id);
    if (!caseExists) {
      return res.status(404).json({ error: 'Caso no encontrado' });
    }

    const { typeId, incidentDate, description, personInvolved, priority, fileName } = req.body;

    if (!typeId || !incidentDate || !description || !priority) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: typeId, incidentDate, description, priority' });
    }

    if (!['Bajo', 'Medio', 'Alto'].includes(priority)) {
      return res.status(400).json({ error: 'Prioridad inválida. Valores permitidos: Bajo, Medio, Alto' });
    }

    const evidence = await addEvidence(id, { typeId, incidentDate, description, personInvolved, priority, fileName });
    res.status(201).json(evidence);
  } catch (err) {
    console.error('createEvidence error:', err);
    res.status(500).json({ error: 'No se pudo guardar la evidencia' });
  }
}

export async function getTimeline(req, res) {
  try {
    const { id } = req.params;
    const caseExists = await getCaseById(id);
    if (!caseExists) {
      return res.status(404).json({ error: 'Caso no encontrado' });
    }
    const evidences = await getEvidencesByCaseId(id);
    res.json(evidences);
  } catch (err) {
    console.error('getTimeline error:', err);
    res.status(500).json({ error: 'No se pudo obtener la línea de tiempo' });
  }
}

export async function getSummary(req, res) {
  try {
    const { id } = req.params;
    const caseData = await getCaseById(id);
    if (!caseData) {
      return res.status(404).json({ error: 'Caso no encontrado' });
    }
    const evidences = await getEvidencesByCaseId(id);

    const timeline = evidences.map(e => ({
      date: new Date(`${e.incidentDate}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: e.description,
      priority: e.priority,
      typeName: e.typeName,
    }));

    const recommendations = [
      'Conserva las capturas y archivos originales en un lugar seguro.',
      'Registra fechas, horas y testigos de cada incidente.',
      'Si hay riesgo inminente, contacta a la policía o fiscalía de tu jurisdicción.',
      'Este resumen es solo organizativo; no constituye asesoría legal.',
    ];

    res.json({
      caseNumber: caseData.caseNumber,
      count: evidences.length,
      timeline,
      recommendations,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'No se pudo generar el resumen' });
  }
}
