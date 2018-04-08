import { Component } from '@angular/core';
import { Spinkit } from 'ng-http-loader/spinkits';
import { SpinnerVisibilityService } from 'ng-http-loader/services/spinner-visibility.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    public spinkit = Spinkit;

    constructor(private spinner: SpinnerVisibilityService) {
    }
}
