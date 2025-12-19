import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFlightComponent } from './book-flight';

describe('BookFlight', () => {
  let component: BookFlightComponent;
  let fixture: ComponentFixture<BookFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFlightComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
