import {
  List,
  ListItem,
  Checkbox,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { parseISO, format } from 'date-fns';
import { Todo } from '../types/todo';
import { Dispatch } from 'react';
import { deleteTodo, updateToggle } from '../controllers/todo';

export const TodoList = ({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
}) => {
  // 오늘 날짜(YYYY-MM-DD) 문자열
  const todayStr = new Date().toISOString().slice(0, 10);

  // 유효성 판단 함수
  const isTooLong   = (t: Todo) => t.text.length > 100;
  const isPastDate  = (t: Todo) => t.deadline < todayStr;

  // 에러 존재 여부
  const hasLongTodo = todos.some(isTooLong);
  const hasPastTodo = todos.some(isPastDate);

  const handleToggleTodo = (id: number) => {
    setTodos(updateToggle(todos, id));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(deleteTodo(todos, id));
  };

  return (
    <Box>
      {/* --- 에러 메시지 렌더링 ------------------------------------- */}
      {hasLongTodo && (
        <Typography color="error" sx={{ mb: 1 }}>
          할 일은 100자 이하로 입력하세요
        </Typography>
      )}
      {hasPastTodo && (
        <Typography color="error" sx={{ mb: 1 }}>
          오늘 날짜 이후로 선택하세요
        </Typography>
      )}

      {/* --- 실제 Todo 리스트 ------------------------------------- */}
      <List sx={{ mt: 1 }}>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <ListItemText
              primary={todo.text}
              secondary={`Deadline: ${format(
                parseISO(todo.deadline),
                'yyyy-MM-dd'
              )}`}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              🗑️
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
