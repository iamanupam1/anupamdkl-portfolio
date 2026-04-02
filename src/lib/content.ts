import { getCollection, getEntry } from 'astro:content';

export async function getSiteInfo() {
  const entry = await getEntry('sections', 'site');
  return entry!.data;
}

export async function getSection(id: string) {
  const entry = await getEntry('sections', id);
  return entry!;
}

export async function getProjects() {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order);
}
