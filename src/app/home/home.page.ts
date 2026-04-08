import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  standalone: true
})
export class HomePage implements OnInit {
  newTitle: string = '';

  constructor(public taskService: TaskService) { }

  ngOnInit() { }

  async addTask() {
    if (this.newTitle.trim().length > 0) {
      await this.taskService.addTask(this.newTitle);
      this.newTitle = '';
    }
  }

  async toggleTask(task: Task) {
    task.completed = !task.completed;
    await this.taskService.updateTask(task);
  }

  async deleteTask(id: number) {
    await this.taskService.deleteTask(id);
  }
}
