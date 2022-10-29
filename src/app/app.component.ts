import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { loadActivities } from './store/activity/activity.actions';
import { ActivityType } from './store/activity/activity.model';
import { selectActivities } from './store/activity/activity.selectors';
import { loadStatuses } from './store/status/status.actions';
import { selectAllTeachersByActivityType } from './store/status/status.selectors';
import { loadUsers } from './store/user/user.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, AsyncPipe],
  template: `
    <h1>Activity Board</h1>
    <div class="section" *ngFor="let activity of activities$ | async">
      <h2>Activity Name: {{ activity.name }}</h2>
      <span>All Teachers available for : {{ activity.type }} are</span>
      <ul>
        <li
          *ngFor="
            let teacher of getAllTeachersForActivityType$(activity.type) | async
          "
        >
          {{ teacher.name }}
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .section {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  activities$ = this.store.select(selectActivities);

  ngOnInit(): void {
    this.store.dispatch(loadActivities());
    this.store.dispatch(loadUsers());
    this.store.dispatch(loadStatuses());
  }

  getAllTeachersForActivityType$ = (type: ActivityType) =>
    this.store.select(selectAllTeachersByActivityType(type));
}
