import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiAvatarComponent } from './avatar.component';
import { AvatarSize } from './avatar.types';

describe('UiAvatarComponent', () => {
  let fixture: ComponentFixture<UiAvatarComponent>;
  let component: UiAvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('inputs', () => {
    it('defaults src to undefined', () => {
      expect(component.src()).toBeUndefined();
    });

    it('defaults alt to "avatar"', () => {
      expect(component.alt()).toBe('avatar');
    });

    it('defaults size to sm', () => {
      expect(component.size()).toBe('sm');
    });

    it('applies the size class for every supported size', () => {
      const sizes: AvatarSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size: AvatarSize) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const avatar = fixture.debugElement.query(By.css('.ui-avatar')).nativeElement;
        expect(avatar.classList.contains(`ui-avatar--${size}`)).toBeTrue();
      });
    });
  });

  describe('image rendering', () => {
    it('renders an img when src is provided', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.detectChanges();

      const img = fixture.debugElement.query(By.css('img.ui-avatar__image')).nativeElement;
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });

    it('sets the alt attribute from the alt input', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.componentRef.setInput('alt', 'User profile');
      fixture.detectChanges();

      const img = fixture.debugElement.query(By.css('img.ui-avatar__image')).nativeElement;
      expect(img.getAttribute('alt')).toBe('User profile');
    });

    it('does not render the fallback content when src is provided', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.detectChanges();

      const avatar = fixture.debugElement.query(By.css('.ui-avatar')).nativeElement;
      expect(avatar.querySelector('img')).toBeTruthy();
    });
  });

  describe('rendering', () => {
    it('renders the internal circle wrapper inside the host', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('.ui-avatar')).toBeTruthy();
    });

    it('does not render the size class on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-avatar')).toBeFalse();
    });
  });
});

describe('UiAvatarComponent (with projected fallback)', () => {
  @Component({
    standalone: true,
    imports: [UiAvatarComponent],
    template: `
      <ui-avatar>
        {{ initials }}
      </ui-avatar>
    `,
  })
  class InitialsHostComponent {
    initials = 'JD';
  }

  @Component({
    standalone: true,
    imports: [UiAvatarComponent],
    template: `
      <ui-avatar size="md">
        <i class="fa fa-user"></i>
      </ui-avatar>
    `,
  })
  class IconHostComponent {}

  let fixture: ComponentFixture<InitialsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialsHostComponent, IconHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialsHostComponent);
    fixture.detectChanges();
  });

  it('projects initials when no src is provided', () => {
    const avatar = fixture.debugElement.query(By.css('.ui-avatar')).nativeElement;
    expect(avatar.textContent).toContain('JD');
  });

  it('projects an icon fallback when no src is provided', () => {
    const host = TestBed.createComponent(IconHostComponent);
    host.detectChanges();

    const avatar = host.debugElement.query(By.css('.ui-avatar')).nativeElement;
    expect(avatar.querySelector('i.fa-user')).toBeTruthy();
  });
});
