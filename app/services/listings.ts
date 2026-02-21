import type { ApiResponse } from '../types/types';
import he from 'he';

const pageCache = new Map<string, ApiResponse>();

/**
 * Convert HTML string to readable plain text
 */
function htmlToText(html: string): string {
    if (!html) return '';

    // Decode HTML entities
    html = he.decode(html);

    // Use DOM parser
    const div = document.createElement('div');
    div.innerHTML = html;

    function walk(node: Node): string {
        let text = '';

        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as HTMLElement;
                switch (el.tagName.toLowerCase()) {
                    case 'br':
                        text += '\n';
                        break;
                    case 'p':
                        text += walk(el).trim() + '\n\n';
                        break;
                    case 'li':
                        text += '- ' + walk(el).trim() + '\n';
                        break;
                    default:
                        text += walk(el);
                        break;
                }
            }
        });

        return text;
    }

    return walk(div).trim();
}

/**
 * Recursively decode object strings
 */
function decodeRecursive<T>(value: T): T {
    if (typeof value === 'string') {
        // Convert HTML to readable text
        return htmlToText(value) as unknown as T;
    }

    if (Array.isArray(value)) {
        return value.map(decodeRecursive) as unknown as T;
    }

    if (value && typeof value === 'object') {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = decodeRecursive((value as any)[key]);
            }
        }
        return result as T;
    }

    return value;
}

export const getJobListings = async (
    searchQuery: string = "",
    locationTerm: string = ""
): Promise<ApiResponse> => {

    const cacheKey = `${searchQuery}_${locationTerm}`;

    if (pageCache.has(cacheKey)) {
        return pageCache.get(cacheKey)!;
    }

    try {
        let url = `https://jobicy.com/api/v2/remote-jobs?count=100`;

        if (searchQuery.trim()) {
            url += `&industry=${encodeURIComponent(searchQuery.trim())}`;
        }

        if (locationTerm.trim()) {
            url += `&geo=${encodeURIComponent(locationTerm.trim())}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData: any = await response.json();

        // Decode all HTML in all strings recursively
        const decodedData = decodeRecursive(rawData);

        const result: ApiResponse = {
            success: decodedData.success ?? true,
            jobs: decodedData.jobs || []
        };

        pageCache.set(cacheKey, result);
        console.log(result);
        return result;

    } catch (error) {
        console.error('Error fetching job listings:', error);
        throw error;
    }
};