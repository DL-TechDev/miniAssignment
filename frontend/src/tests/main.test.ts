import { describe, test, it, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';

import MiniAssignment from '../routes/+page.svelte';
import axios from 'axios';
import Papa from 'papaparse';
import { vi } from 'vitest';

// Mock axios and Papa.parse
vi.mock('axios');
vi.mock('papaparse', () => ({
	parse: vi.fn()
}));

describe('MiniAssignment', () => {

  test('this should handle file selection', async () => {
    const { getByTestId} = render(MiniAssignment);
    const input = getByTestId('fileSelect');
    
    // Simulate file selection
    const file = new File(['postId,id,name,email,body'], 'test.csv', { type: 'text/csv' });
    await fireEvent.change(input, { target: { files: [file] } });
    
    expect(input.files[0]).toBe(file);
  });
});