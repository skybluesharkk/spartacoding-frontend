import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {TodoForm }from '../todo-form'
import '@testing-library/jest-dom'

describe('TodoForm 컴포넌트 단위 테스트', () => {
  it('TextField(할 일), DateField(Deadline), Add 버튼이 화면에 보여야 한다', () => {
    render(<TodoForm todos={[]} setTodos={() => {}} />)

    const todoInput = screen.getByLabelText(/New Todo/i)
    expect(todoInput).toBeInTheDocument()

    const dateInput = screen.getByLabelText(/Deadline/i)
    expect(dateInput).toBeInTheDocument()
    expect(dateInput).toHaveAttribute('type', 'date')

    const addButton = screen.getByRole('button', { name: /Add Todo|Add/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('텍스트와 데드라인을 모두 입력해야만 Add 버튼이 활성화된다', () => {
    render(<TodoForm todos={[]} setTodos={() => {}} />)

    const todoInput = screen.getByLabelText(/New Todo/i)
    const dateInput = screen.getByLabelText(/Deadline/i)
    const addButton = screen.getByRole('button', { name: /Add Todo|Add/i })

    expect(addButton).toBeDisabled()

    fireEvent.change(todoInput, { target: { value: '테스트 할 일' } })
    expect(addButton).toBeDisabled()

    fireEvent.change(todoInput, { target: { value: '' } })
    fireEvent.change(dateInput, { target: { value: '2025-06-15' } })
    expect(addButton).toBeDisabled()

    fireEvent.change(todoInput, { target: { value: '테스트 할 일' } })
    fireEvent.change(dateInput, { target: { value: '2025-06-15' } })
    expect(addButton).toBeEnabled()
  })

  it('Add 버튼 클릭 시, setTodos 콜백이 호출되어야 한다', () => {
    const mockSetTodos = vi.fn()
    render(<TodoForm todos={[]} setTodos={mockSetTodos} />)

    const todoInput = screen.getByLabelText(/New Todo/i)
    const dateInput = screen.getByLabelText(/Deadline/i)
    const addButton = screen.getByRole('button', { name: /Add Todo|Add/i })

    fireEvent.change(todoInput, { target: { value: '할 일 1' } })
    fireEvent.change(dateInput, { target: { value: '2025-07-01' } })
    fireEvent.click(addButton)

    expect(mockSetTodos).toHaveBeenCalledTimes(1)


  })
})
