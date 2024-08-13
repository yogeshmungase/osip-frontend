import { Component,  } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {

  constructor(private http: HttpClient) {

  }

  sendEmail() {
    const emailData = {
      to: 'yogeshmungase2000@gmail.com',
      subject: 'Subject of the email',
      body: 'Body of the email'
    };
    console.log(emailData);
    // alert(emailData);

    this.http.post('http://localhost:8080/api/email/send', emailData)
      .subscribe((response: any) => {
        console.log('Email sent successfully', response);
        alert('Email sent successfully');
      }, (error: any) => {
        console.error('Error sending email', error);
      });
  }
  sendWhatsAppMessage() {
    const phoneNumber = '+917038637622'; // Enter the phone number here
    const message = encodeURIComponent('Your WhatsApp message goes here');

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
  }
}