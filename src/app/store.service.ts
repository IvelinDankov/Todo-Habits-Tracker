import { Injectable, signal } from "@angular/core";
import { Habit } from "./models/habit/habit.model.js";
import { Todo } from "./models/todo/tido.model.js";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  habits = signal<Habit[]>([]);
  todo = signal<Todo[]>([]);

  settings = signal<{ theme: "light" | "dark"; notifications: boolean }>({
    theme: "light",
    notifications: false,
  });

  constructor() {}
}
