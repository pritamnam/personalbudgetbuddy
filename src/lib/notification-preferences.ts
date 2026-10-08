export function dueReminderCount(tasks: readonly { due: string; done: boolean }[], today: string) {
  return tasks.filter((task) => !task.done && task.due !== "" && task.due <= today).length;
}