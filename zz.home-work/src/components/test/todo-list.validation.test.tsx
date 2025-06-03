import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {TodoList} from '../todo-list'
import '@testing-library/jest-dom'

describe('TodoList 신규 기능 유효성 테스트', () => {
  it('할 일 입력 시 100자 초과이면 에러 메시지 노출', () => {
    const longText = 'a'.repeat(101)
    render(<TodoList todos={[{ id: 1, text: longText, completed: false, deadline: '2025-01-01' }]} setTodos={vi.fn()} />)
    expect(screen.getByText(/100자 이하로 입력하세요/i)).toBeInTheDocument()
  })

  it('할 일 입력 시 데드라인이 오늘 이전이면 에러 메시지 노출', () => {
    const today = new Date().toISOString().slice(0, 10)        
    const yesterday = new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10)
    render(
      <TodoList
        todos={[{ id: 2, text: '테스트', completed: false, deadline: yesterday }]}
        setTodos={vi.fn()}
      />
    )
    expect(screen.getByText(/오늘 날짜 이후로 선택하세요/i)).toBeInTheDocument()
  })
})
