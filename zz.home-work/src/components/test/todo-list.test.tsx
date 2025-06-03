// zz.home-work/src/components/test/todo-list.test.tsx

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TodoList } from '../todo-list'
import '@testing-library/jest-dom'

interface Todo {
  id: number
  text: string
  completed: boolean
  deadline: string
}

describe('TodoList 컴포넌트 단위 + 스냅샷 테스트', () => {
  const sampleTodos: Todo[] = [
    { id: 1, text: '할 일 1', completed: false, deadline: '2025-06-10' },
    { id: 2, text: '할 일 2', completed: true,  deadline: '2025-07-01' },
  ]

  it('todos 배열이 화면에 제대로 렌더링되어야 한다 (텍스트 + Deadline)', () => {
    render(<TodoList todos={sampleTodos} setTodos={vi.fn()} />)

    expect(screen.getByText(/할 일 1/)).toBeInTheDocument()
    expect(screen.getByText(/Deadline: 2025-06-10/)).toBeInTheDocument()

    expect(screen.getByText(/할 일 2/)).toBeInTheDocument()
    expect(screen.getByText(/Deadline: 2025-07-01/)).toBeInTheDocument()
  })

  it('completed=true인 경우, 최상위 ListItemText 엘리먼트에 text-decoration: line-through가 적용되어야 한다', () => {
    render(<TodoList todos={sampleTodos} setTodos={vi.fn()} />)

    // 1) “할 일 2” 텍스트 노드를 가져온다
    const completedTextNode = screen.getByText(/할 일 2/)

    // 2) 최상위 div 엘리먼트를 찾아서 wrapperElement에 할당
    const wrapperElement = completedTextNode.closest('div')

    // 3) null이 아닌지 먼저 검증
    expect(wrapperElement).not.toBeNull()

    // 4) null이 아님을 확인한 뒤 스타일을 검사
    if (wrapperElement) {
      expect(wrapperElement).toHaveStyle({ textDecoration: 'line-through' })
    }
  })

  it('체크박스를 클릭하면 setTodos(updateToggle) 콜백이 호출되어야 한다', () => {
    const mockSetTodos = vi.fn()
    render(<TodoList todos={sampleTodos} setTodos={mockSetTodos} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(mockSetTodos).toHaveBeenCalled()
  })

  it('스냅샷 테스트: 초기 렌더링 시점의 HTML 구조가 변경되지 않아야 한다', () => {
    const { container } = render(
      <TodoList todos={sampleTodos} setTodos={vi.fn()} />
    )
    expect(container).toMatchSnapshot()
  })
})
