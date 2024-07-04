import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserShow } from 'src/app/user-detailed/user-detailed.service';

@Component({
  selector: 'app-follow-form',
  templateUrl: './follow-form.component.html',
  styleUrls: ['./follow-form.component.scss']
})
export class FollowFormComponent {
  @Input() id: string | null = null;
  @Input() user: UserShow | null = null;
  @Input() isSubmitting = false;
  @Output() handleUnfollow: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() handleFollow: EventEmitter<Event> = new EventEmitter<Event>();
}
