import { computed, effect, Injectable, signal } from "@angular/core";
import { Habit } from "./models/habit/habit.model.js";
import { Todo } from "./models/todo/tido.model.js";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private _habits = signal<Habit[]>([]);
  private _todo = signal<Todo[]>([]);

  private _settings = signal<{
    theme: "light" | "dark";
    notifications: boolean;
  }>({
    theme: "light",
    notifications: false,
  });

  // READ-ONLY
  habits = this._habits.asReadonly();
  todo = this._todo.asReadonly();
  settings = this._settings.asReadonly();

  // COMPUTED SIGNAL

  totalHabits = computed(() => this._habits().length);
  habitsCompletedToday = computed(() => {
    this._habits().filter((h) => h.completed).length; // filter + length
  });
  todosPending = computed(
    () => this._todo().filter((t) => !t.completed).length,
  );

  constructor() {
    effect(() => {
      localStorage.setItem("habits", JSON.stringify(this._habits()));
      localStorage.setItem("todos", JSON.stringify(this._todo()));
      localStorage.setItem("settings", JSON.stringify(this._settings()));
    });

    this.loadData();
  }

  /* 
  export interface Habit {
  id: string;
  name: string;
  completed: string;
  streak: string;
  dates: [];
}
  */

  addHabit(name: string) {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completed: false,
      streak: 0,
      dates: [],
    };

    this._habits.update((habits) => [...habits, newHabit]);
  }

  toggleHabit(id: string) {
    this._habits.update((habits) =>
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              streak: habit.completed ? habit.streak - 1 : habit.streak + 1,
            }
          : habit,
      ),
    );
  }

  addTodo(text: string) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: "medium",
      created: new Date().toISOString(),
    };
    this._todo.update((todo) => [...todo, newTodo]);
  }

  deleteItem(type: "habit" | "todo", id: string) {
    if (type === "habit") {
      this._habits.update((habits) => habits.filter((h) => h.id !== id));
    } else {
      this._todo.update((todo) => todo.filter((t) => t.id !== id));
    }
  }

  loadData() {
    const savedHabits = localStorage.getItem("habits");
    const savedTodos = localStorage.getItem("todo");
    const savedSettings = localStorage.getItem("settings");

    if (savedHabits) this._habits.set(JSON.parse(savedHabits));
    if (savedTodos) this._todo.set(JSON.parse(savedTodos));
    if (savedSettings) this._settings.set(JSON.parse(savedSettings));
  }
}
