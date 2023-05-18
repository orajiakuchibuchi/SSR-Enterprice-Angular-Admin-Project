import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const $:any
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @ViewChild('accordion-menu') accordion:ElementRef;
  constructor() { }

  ngOnInit(): void {
    $('.menu-icon, [data-toggle="left-sidebar-close"]').on("click", function () {
      //$(this).toggleClass('open');
      $("body").toggleClass("sidebar-shrink");
      $(".left-side-bar").toggleClass("open");
      $(".mobile-menu-overlay").toggleClass("show");
    });
    	// sidebar menu Active Class
      $(this.el.nativeElement).each(function () {
		var vars = window.location.href.split("/").pop();
		$(this)
			.find('a[href="' + vars + '"]')
			.addClass("active");
	});

    $("input:radio[name=menu-dropdown-icon]").change( ()=> {
			// var className = $('input:radio[name=menu-dropdown-icon]:checked').val().toLowerCase().replace(/\s+/, "-");
			// $(".sidebar-menu").attr('class', 'sidebar-menu ' + className);
			// setOptions("menuDropdownIcon", className);
			var newClass1 = ["sidebar-menu"];
			newClass1.push(
				$("input:radio[name=menu-dropdown-icon]:checked")
					.val()
					.toLowerCase()
					.replace(/\s+/, "-")
			);
			newClass1.push(
				$("input:radio[name=menu-list-icon]:checked")
					.val()
					.toLowerCase()
					.replace(/\s+/, "-")
			);
			$(".sidebar-menu").attr("class", newClass1.join(" "));
			this.setOptions("menuDropdownIcon", newClass1.slice(-2)[0]);
		});
    		// Menu List Icon
		$("input:radio[name=menu-list-icon]").change( ()=> {
			var newClass = ["sidebar-menu"];
			newClass.push(
				$("input:radio[name=menu-dropdown-icon]:checked")
					.val()
					.toLowerCase()
					.replace(/\s+/, "-")
			);
			newClass.push(
				$("input:radio[name=menu-list-icon]:checked")
					.val()
					.toLowerCase()
					.replace(/\s+/, "-")
			);
			$(".sidebar-menu").attr("class", newClass.join(" "));
			this.setOptions("menuListIcon", newClass.slice(-1)[0]);
		});
  }
  		/**
		 * Set local storage property value
		 */
    setOptions(propertyName:any, propertyValue:any) {
        //Store in local storage
        var optionsCopy = Object.assign({}, this.getOptions());
        optionsCopy[propertyName] = propertyValue;
  
        //Store in local storage
        localStorage.setItem("optionsObject", JSON.stringify(optionsCopy));
      }
      getOptions() {
        return JSON.parse(<any>localStorage.getItem("optionsObject"));
      }

}
