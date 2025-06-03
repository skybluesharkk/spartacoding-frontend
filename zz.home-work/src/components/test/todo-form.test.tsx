import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {TodoForm }from '../todo-form'
import '@testing-library/jest-dom'

describe('TodoForm 컴포넌트 단위 테스트', () => {
  it('TextField(할 일), DateField(Deadline), Add 버튼이 화면에 보여야 한다', () => {
    render(<TodoForm todos={[]} setTodos={() => {}} />)

    // 1) 할 일 입력란 (label="New Todo" 혹은 placeholder를 확인)
    const todoInput = screen.getByLabelText(/New Todo/i)
    expect(todoInput).toBeInTheDocument()

    // 2) 데드라인 입력란 (label="Deadline", type="date"인 <TextField>)
    const dateInput = screen.getByLabelText(/Deadline/i)
    expect(dateInput).toBeInTheDocument()
    expect(dateInput).toHaveAttribute('type', 'date')

    // 3) Add Todo 버튼: 초기에는 비활성화 상태여야 한다
    const addButton = screen.getByRole('button', { name: /Add Todo|Add/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('텍스트와 데드라인을 모두 입력해야만 Add 버튼이 활성화된다', () => {
    render(<TodoForm todos={[]} setTodos={() => {}} />)

    const todoInput = screen.getByLabelText(/New Todo/i)
    const dateInput = screen.getByLabelText(/Deadline/i)
    const addButton = screen.getByRole('button', { name: /Add Todo|Add/i })

    // 1) 아무 입력도 없을 때: 버튼 비활성화
    expect(addButton).toBeDisabled()

    // 2) 텍스트만 입력했을 때: 버튼 여전히 비활성화
    fireEvent.change(todoInput, { target: { value: '테스트 할 일' } })
    expect(addButton).toBeDisabled()

    // 3) 텍스트 지우고 데드라인만 입력했을 때: 버튼 여전히 비활성화
    fireEvent.change(todoInput, { target: { value: '' } })
    fireEvent.change(dateInput, { target: { value: '2025-06-15' } })
    expect(addButton).toBeDisabled()

    // 4) 둘 다 입력했을 때: 버튼 활성화
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

    // ① todo + deadline 입력 → ② 버튼 클릭
    fireEvent.change(todoInput, { target: { value: '할 일 1' } })
    fireEvent.change(dateInput, { target: { value: '2025-07-01' } })
    fireEvent.click(addButton)

    // setTodos가 딱 한 번 호출되었는지 검증
    expect(mockSetTodos).toHaveBeenCalledTimes(1)

    // 호출된 인자(payload)에 방금 입력한 데이터가 들어갔는지 간단히 확인할 수도 있습니다.
    // e.g. mockSetTodos.mock.calls[0][0] 을 확인해서
    // 배열 안에 { id: <number>, text: '할 일 1', completed: false, deadline: '2025-07-01' } 가 있는지 등
  })
})
