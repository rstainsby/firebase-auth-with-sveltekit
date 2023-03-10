<div class="two-column-layout">
    <div class="column-one">
        <slot></slot>
    </div>
    <div class="column-two">
  
    </div>
</div>

<style>
  .two-column-layout {
    display: grid;
    grid-template-columns: minmax(460px, 40%) auto;
    grid-template-rows: auto;
    height: 100vh;
  }

  .column-one {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
  }

  .column-two {
    height: 100%;
    background-color: var(--cl-navy-blue);    
  }
</style>