import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dynamic-two-color-pie-chart',
  templateUrl: './dynamic-two-color-pie-chart.component.html',
  styleUrls: ['./dynamic-two-color-pie-chart.component.css']
})
export class DynamicTwoColorPieChartComponent implements OnInit {

  @Input() size = 100;
  @Input() backgroundColor = '#9ACD32';
  @Input() progressColor = '#EE7942';
  @Input() progress = 25;

  constructor() { }

  get pixelSize() {
    return this.size + 'px';
  }

  get strokeDasharray() {
    return this.progress + ' 100';
  }

  ngOnInit() {
  }
}
