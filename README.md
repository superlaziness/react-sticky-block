# react-sticky-block
---

Right way to make your block sticky


## Install

```sh npm install react-sticky-block```


## Usage

```js
import StickyBlock from 'react-sticky-block';

const MyComponent = () => (
  <div className="my-container" style={{position: 'relative'}}>
    <StickyBlock>
      <div>Any Content</div>
    </StickyBlock>
  </div>
);
```

Movement of sticky block is limited by height of their container.
Container must have relative positioning applied.

## StickyBlock props

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">name</th>
      <th style="width: 100px;">type</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>topOffset</td>
      <td>number</td>
      <td>height in px from the top of the screen to stuck block</td>
    </tr>
    <tr>
      <td>bottomOffset</td>
      <td>number</td>
      <td>height in px from the bottom of the screen to stuck block</td>
    </tr>
    <tr>
      <td>initTimeout</td>
      <td>number</td>
      <td>timeout in ms before it determine initial size and position of sticky block</td>
    </tr>
  </tbody>
</table>

