import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from './InputField';

// Mock for testing
const mockOnChange = jest.fn();

describe('InputField', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders basic input with label', () => {
    render(
      <InputField
        label="Test Label"
        placeholder="Enter text"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays error message when invalid', () => {
    render(
      <InputField
        label="Test Label"
        invalid={true}
        errorMessage="This field is required"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    render(
      <InputField
        label="Test Label"
        helperText="This is helper text"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(
      <InputField
        label="Test Label"
        disabled={true}
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeDisabled();
  });

  it('handles loading state', () => {
    render(
      <InputField
        label="Test Label"
        loading={true}
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeDisabled();
  });

  it('shows clear button when enabled and has value', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Test Label"
        showClearButton={true}
        value="test value"
        onChange={mockOnChange}
      />
    );
    
    const clearButton = screen.getByLabelText('Clear input');
    expect(clearButton).toBeInTheDocument();
    
    await user.click(clearButton);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' })
      })
    );
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        type="password"
        label="Password"
        showPasswordToggle={true}
        value="secret"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(input.type).toBe('password');
    
    await user.click(toggleButton);
    expect(input.type).toBe('text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <InputField
        label="Test Label"
        variant="filled"
        value=""
        onChange={mockOnChange}
      />
    );
    
    let input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('bg-gray-100');
    
    rerender(
      <InputField
        label="Test Label"
        variant="outlined"
        value=""
        onChange={mockOnChange}
      />
    );
    
    input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-2');
    
    rerender(
      <InputField
        label="Test Label"
        variant="ghost"
        value=""
        onChange={mockOnChange}
      />
    );
    
    input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-b-2');
  });

  it('applies correct size styles', () => {
    const { rerender } = render(
      <InputField
        label="Test Label"
        size="sm"
        value=""
        onChange={mockOnChange}
      />
    );
    
    let input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('text-sm');
    
    rerender(
      <InputField
        label="Test Label"
        size="lg"
        value=""
        onChange={mockOnChange}
      />
    );
    
    input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('text-lg');
  });

  it('handles input changes', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Test Label"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'hello');
    
    expect(mockOnChange).toHaveBeenCalledTimes(5); // once for each character
  });

  it('shows required indicator', () => {
    render(
      <InputField
        label="Test Label"
        required={true}
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});