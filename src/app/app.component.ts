import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  model: any;
  loading: boolean = false; 
  imgSrc: string;
  predictions: any[];
  @ViewChild('img', { read: ElementRef, static: false }) img;

  constructor() { }
 
  async ngOnInit() {
    this.loading = true;
    // this.model = await mobilenet.load();
    
    this.model = await tf.loadLayersModel("assets/models/model.json");
    this.loading = false;
  }

  async fileChange(event: Event) {
    const target: HTMLInputElement = <HTMLInputElement>event.target;
    const files: FileList = target.files;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
 
      reader.readAsDataURL(file);
 
      reader.onload = (res: any) => {
        this.imgSrc = res.target.result;

        setTimeout(async () => {
          // this.predictions = await this.model.classify(this.img.nativeElement);
          // preprocess canvas
          let tensor = this.preprocessCanvas(this.img.nativeElement);
      
          // make predictions on the preprocessed image tensor
          let predictions = await this.model.predict(tensor).data();

          console.log(predictions);
      
          // get the model's prediction results
          this.predictions = Array.from(predictions);

          console.log(this.predictions);
        });
 
      };
    }
  }

  preprocessCanvas(image) {
    // resize the input image to target size of (1, 28, 28)
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    return tensor.div(255.0);
  }

}


