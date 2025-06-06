import { Component } from '@angular/core';
import {
  _processContentResult,
  fetchOneEntry,
  getBuilderSearchParams,
  registerAction,
  type RegisteredComponent,
} from '@builder.io/sdk-angular';
import { getProps } from '@sdk/tests';
import { customComponents } from './custom-components';

interface BuilderProps {
  apiVersion: string;
  canTrack?: boolean;
  trustedHosts?: undefined;
  apiKey: string;
  model: string;
  content: any;
  data?: any;
  apiHost?: string;
  locale?: string;
}

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="content; else notFound">
      <builder-content
        [model]="model"
        [content]="content"
        [apiKey]="apiKey"
        [trustedHosts]="trustedHosts"
        [canTrack]="canTrack"
        [customComponents]="customComponents"
        [data]="data"
        [apiHost]="apiHost"
        [locale]="locale"
      ></builder-content>
    </ng-container>

    <ng-template #notFound>
      <div>404 - Content not found</div>
    </ng-template>
  `,
})
export class AppComponent {
  title = 'angular';
  apiVersion: BuilderProps['apiVersion'] = 'v3';
  canTrack: BuilderProps['canTrack'];
  trustedHosts: BuilderProps['trustedHosts'];
  apiKey: BuilderProps['apiKey'] = 'abcd';
  model: BuilderProps['model'] = 'page';
  content: BuilderProps['content'];
  data: BuilderProps['data'];
  apiHost: BuilderProps['apiHost'];
  locale: BuilderProps['locale'];

  customComponents: RegisteredComponent[] = customComponents;

  async ngOnInit() {
    const urlPath = window.location.pathname || '';

    const builderProps = await getProps({
      pathname: urlPath,
      _processContentResult,
      options: getBuilderSearchParams(
        new URLSearchParams(window.location.search)
      ),
      fetchOneEntry,
    });

    if (!builderProps) {
      return;
    }

    if (typeof window !== 'undefined') {
      registerAction({
        name: 'test-action',
        kind: 'function',
        id: 'test-action-id',
        inputs: [
          {
            name: 'actionName',
            type: 'string',
            required: true,
            helperText: 'Action name',
          },
        ],
        action: () => {
          return `console.log("function call") `;
        },
      });
    }

    this.content = builderProps.content;
    this.canTrack = builderProps.canTrack;
    this.trustedHosts = builderProps.trustedHosts;
    this.apiKey = builderProps.apiKey;
    this.model = builderProps.model;
    this.apiVersion = builderProps.apiVersion;
    this.data = builderProps.data;
    this.apiHost = builderProps.apiHost;
    this.locale = builderProps.locale;
  }
}
