<script lang="ts">
  import { Link } from "svelte-routing";
  import { Label, Input, Button } from "flowbite-svelte";
  import { form, field } from "svelte-forms";
  import { login } from "../stores/auth";
  import { required } from "svelte-forms/validators";

  const username = field("username", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(username, password);
  const handleLogin = () => {
    const data = loginForm.summary();
    login(data.username, data.password);
  };
</script>

<p class="text-xl text-center my-4">
  You are not logged in. Please login first or <Link
    class="text-blue-600 hover:text-blue-300 hover:cursor-pointer"
    to="signup">signup</Link
  >
</p>
<form class="max-w-2xl mx-auto" on:submit|preventDefault={handleLogin}>
  <Label>Username</Label>
  <Input
    type="text"
    id="username-input"
    class="max-w-2xl mx-auto"
    bind:value={$username.value}
  />
  <Label class="mt-2">Password</Label>
  <Input
    type="password"
    id="password-input"
    class="max-w-2xl mx-auto"
    bind:value={$password.value}
  />
  <Button class="mt-2" type="submit">Login</Button>
</form>
