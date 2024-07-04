import { useEffect, useReducer, useState } from 'react';
import './App.css';
import { FaEdit } from 'react-icons/fa';
import { IoTrashBin } from 'react-icons/io5';

const ACTION = {
	ADD_TO_DO: 'addtodo',
	DELETE_TO_DO: 'deletetodo',
	EDIT_TO_DO: 'edittodo',
};
function reducer(state, { type, payload }) {
	switch (type) {
		case ACTION.ADD_TO_DO:
			if (payload.task === '') {
				return state;
			}
			return { todo: [payload.task, ...state.todo] };

		case ACTION.DELETE_TO_DO:
			return {
				todo: state.todo.filter((value, index) => {
					return payload.idx != index;
				}),
			};
		case ACTION.EDIT_TO_DO:
			return {
				todo: state.todo.map((value, index) => {
					if (index == payload.editTask.index) {
						return payload.editTask.value;
					}
					return value;
				}),
			};
		default:
			return state;
	}
}

function App() {
	const [{ todo }, dispatch] = useReducer(reducer, {
		todo: localStorage.getItem('data').split(/[,]/) || [],
	});

	const [task, setTask] = useState('');
	const [hidden, setHidden] = useState(true);
	const [editTask, setEditTask] = useState({ index: null, value: '' });

	useEffect(() => {
		localStorage.setItem('data', todo);
	}, [todo]);

	return (
		<>
			<div className="todo_grid">
				<p>get things done!</p>
				<div className="todo">
					<input
						type="text"
						placeholder="What is the task today"
						value={task}
						onChange={(e) => {
							setTask(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.keyCode === 13) {
								dispatch({ type: ACTION.ADD_TO_DO, payload: { task } });
								setTask('');
							}
						}}
					></input>
					<button
						onClick={() => {
							dispatch({ type: ACTION.ADD_TO_DO, payload: { task } });
							setTask('');
						}}
					>
						add task
					</button>
				</div>
				{!hidden ? (
					<div className="edit_todo">
						<input
							type="text"
							value={editTask.value}
							onChange={(e) => {
								setEditTask({ ...editTask, value: e.target.value });
							}}
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									dispatch({
										type: ACTION.EDIT_TO_DO,
										payload: { editTask },
									});
									setHidden(true);
								}
							}}
						></input>
						<button
							onClick={() => {
								dispatch({
									type: ACTION.EDIT_TO_DO,
									payload: { editTask },
								});
								setHidden(true);
							}}
						>
							Edit task
						</button>
					</div>
				) : null}

				<div className="todo_list">
					{todo.map((value, index) => {
						return (
							<div className="task" key={index}>
								<p>{value}</p>
								<div className="task_options">
									<FaEdit
										style={{ cursor: 'pointer' }}
										onClick={() => {
											setHidden(false);
											setEditTask({ index, value });
										}}
									/>
									<IoTrashBin
										style={{ cursor: 'pointer' }}
										onClick={() => {
											dispatch({
												type: ACTION.DELETE_TO_DO,
												payload: { idx: index },
											});
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default App;
