import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('accordionmenu') accordion!: ElementRef;
  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    $('.menu-icon, [data-toggle="left-sidebar-close"]').on("click", ()=> {
      //$(this.accordion.nativeElement).toggleClass('open');
      $("body").toggleClass("sidebar-shrink");
      $(".left-side-bar").toggleClass("open");
      $(".mobile-menu-overlay").toggleClass("show");
    });
    // sidebar menu Active Class
    $(this.accordion.nativeElement).each(() => {
      var vars = window.location.href.split("/").pop();
      $(this.accordion.nativeElement)
        .find('a[href="' + vars + '"]')
        .addClass("active");
    });
    $("#accordionmenu").vmenuModule({
      Speed: 400,
      autostart: false,
      autohide: true,
    });

    $("input:radio[name=menu-dropdown-icon]").change(() => {
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
    $("input:radio[name=menu-list-icon]").change(() => {
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
    $.fn.vmenuModule = (option:any) => {
      var obj, item;
      var options = $.extend(
        {
          Speed: 220,
          autostart: true,
          autohide: 1,
        },
        option
      );
      obj = $(this.accordion.nativeElement);
  
      item = obj.find("ul").parent("li").children("a");
      item.attr("data-option", "off");
  
      item.unbind("click").on("click", ()=> {
        var a = $(this.accordion.nativeElement);
        if (options.autohide) {
          a.parent()
            .parent()
            .find("a[data-option='on']")
            .parent("li")
            .children("ul")
            .slideUp(options.Speed / 1.2, ()=> {
              $(this.accordion.nativeElement).parent("li").children("a").attr("data-option", "off");
              $(this.accordion.nativeElement).parent("li").removeClass("show");
            });
        }
        if (a.attr("data-option") == "off") {
          a.parent("li")
            .children("ul")
            .slideDown(options.Speed, ()=> {
              a.attr("data-option", "on");
              a.parent("li").addClass("show");
            });
        }
        if (a.attr("data-option") == "on") {
          a.attr("data-option", "off");
          a.parent("li").children("ul").slideUp(options.Speed);
          a.parent("li").removeClass("show");
        }
      });
      if (options.autostart) {
        obj.find("a").each(()=> {
          $(this.accordion.nativeElement)
            .parent("li")
            .parent("ul")
            .slideDown(options.Speed, ()=> {
              $(this.accordion.nativeElement).parent("li").children("a").attr("data-option", "on");
            });
        });
      } else {
        obj.find("a.active").each(()=> {
          $(this.accordion.nativeElement)
            .parent("li")
            .parent("ul")
            .slideDown(options.Speed, ()=> {
              $(this.accordion.nativeElement).parent("li").children("a").attr("data-option", "on");
              $(this.accordion.nativeElement).parent("li").addClass("show");
            });
        });
      }
    };
  }

  ngOnInit(): void {

  }
  /**
 * Set local storage property value
 */
  setOptions(propertyName: any, propertyValue: any) {
    //Store in local storage
    var optionsCopy = Object.assign({}, this.getOptions());
    optionsCopy[propertyName] = propertyValue;

    //Store in local storage
    localStorage.setItem("optionsObject", JSON.stringify(optionsCopy));
  }
  getOptions() {
    return JSON.parse(<any>localStorage.getItem("optionsObject"));
  }
  navigateTo(route:any){
    this.router.navigate([route])
  }

}
