<script lang="ts">
  import { Helper } from "flowbite-svelte";

  export let field;
</script>

{#if $field.invalid}
  <Helper>
    Invalid: {$field.errors}
  </Helper>
{/if}
