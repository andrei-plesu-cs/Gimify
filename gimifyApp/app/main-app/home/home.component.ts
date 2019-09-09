import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private currRouter: ActivatedRoute
  ) {

  }

  ngOnInit() {
  }

  //function that gets triggered when any of the
  //links gets clicked gets clicked
  onClickLink(whereTo: string): void {
    console.log(whereTo);

    if (!whereTo) {
      return;
    } else {
      this.router.navigate([whereTo], {relativeTo: this.currRouter})
    }

  }

}
