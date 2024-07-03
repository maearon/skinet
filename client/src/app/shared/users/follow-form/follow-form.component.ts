import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserShow } from 'src/app/user-detailed/user-detailed.service';

@Component({
  selector: 'app-follow-form',
  templateUrl: './follow-form.component.html',
  styleUrls: ['./follow-form.component.scss']
})
export class FollowFormComponent {
  @Input() id: string = '';
  @Input() user: UserShow | null = null;

  @Output() follow = new EventEmitter<Event>();
  @Output() unfollow = new EventEmitter<Event>();

  handleSubmit(event: Event, action: 'follow' | 'unfollow'): void {
    event.preventDefault();
    if (action === 'follow') {
      this.follow.emit(event);
    } else if (action === 'unfollow') {
      this.unfollow.emit(event);
    }
  }
}
