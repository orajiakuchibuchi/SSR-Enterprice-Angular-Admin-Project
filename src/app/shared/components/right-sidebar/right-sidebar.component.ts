import { Component, OnInit } from '@angular/core';
declare const $:any;
declare const jQuery:any;

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    		//Layout settings visible
		$('[data-toggle="right-sidebar"]').on("click", function () {
			jQuery(".right-sidebar").addClass("right-sidebar-visible");
		});

		//THEME OPTION CLOSE BUTTON
		$('[data-toggle="right-sidebar-close"]').on("click", function () {
			jQuery(".right-sidebar").removeClass("right-sidebar-visible");
		});

  }

}
