import axios from 'axios';

const BASE_URL = 'https://anonymousananta-jif-backend.hf.space';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jif_token');
  if (token && config.url) {
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}token=${token}`;
  }
  return config;
});

// Auth
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/judge/login`, { email, password });
  return response.data;
};

// Cases
export const createCase = async (data: { title: string; client_name: string; description: string }) => {
  const response = await api.post('/cases/create', data);
  return response.data;
};

export const getAllCases = async () => {
  const response = await api.get('/cases/all');
  return response.data;
};

export const getCaseById = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}`);
  return response.data;
};

export const updateCaseStatus = async (caseId: string, status: string) => {
  const response = await api.post(`/cases/${caseId}/update-status`, { status });
  return response.data;
};

export const getCaseStatus = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}/status`);
  return response.data;
};

// Documents
export const uploadDocument = async (caseId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/cases/${caseId}/upload-doc`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDocuments = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}/documents`);
  return response.data;
};

// OCR
export const runOCR = async (caseId: string, docId: string) => {
  const response = await api.post(`/cases/${caseId}/ocr`, { doc_id: docId });
  return response.data;
};

// Summary
export const generateSummary = async (caseId: string, textId: string) => {
  const response = await api.post(`/cases/${caseId}/summarize`, { text_id: textId });
  return response.data;
};

// IPC
export const suggestIPC = async (text: string) => {
  const response = await api.post('/analyse/suggest_ipc', { text });
  return response.data;
};

// Precedents
export const indexDocument = async (text: string, metadata: Record<string, any>) => {
  const response = await api.post('/embeddings/index_doc', { text, metadata });
  return response.data;
};

export const findPrecedents = async (query: string, topK: number = 5) => {
  const response = await api.post('/analyse/find_precedents', { query, top_k: topK });
  return response.data;
};

// Similar Cases
export const getSimilarCases = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}/similar`);
  return response.data;
};

// Notes
export const addNote = async (caseId: string, note: string) => {
  const response = await api.post(`/cases/${caseId}/add-note`, { note });
  return response.data;
};

export const getNotes = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}/notes`);
  return response.data;
};

// Alerts
export const addAlert = async (caseId: string, message: string, dueDate: string) => {
  const response = await api.post(`/cases/${caseId}/add-alert`, { message, due_date: dueDate });
  return response.data;
};

export const getAlerts = async (caseId: string) => {
  const response = await api.get(`/cases/${caseId}/alerts`);
  return response.data;
};

export default api;
