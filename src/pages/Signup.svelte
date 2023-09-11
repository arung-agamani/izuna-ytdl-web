<script lang="ts">
    import { Label, Input, Button, Helper } from "flowbite-svelte";
    import { field, form } from "svelte-forms";
    import { pattern, required } from "svelte-forms/validators";
    import { link, navigate } from "svelte-routing";
    import apiAxios from "../lib/axios";
    import { toast } from "@zerodevx/svelte-toast";
    import { AxiosError } from "axios";
    import FieldValidationHelper from "../components/FieldValidationHelper.svelte";
    const username = field("username", "", [required(), pattern(/[a-z]{3,}/)]);
    const password = field("password", "", [
        required(),
        pattern(/[A-Za-z0-9]{8,}/),
    ]);

    const confirmPassword = field("confirm_password", "", [
        required(),
        pattern(/[A-Za-z0-9]{8,}/),
        (value: any) => {
            return {
                name: "match_password",
                valid: value === $password.value,
            };
        },
    ]);
    password.subscribe(async (value) => {
        await confirmPassword.validate();
    });

    const signupCode = field("signin_code", "", [
        required(),
        pattern(/[A-Z]{32}/),
    ]);
    const registerForm = form(username, password, signupCode, confirmPassword);
    const handleRegister = async () => {
        try {
            await registerForm.validate();
            if (!$registerForm.valid) {
                console.error("invalid form", $registerForm.errors);
                toast.push("Invalid form", {});
                return;
            }

            const data = registerForm.summary();
            console.log(data);
            const res = await apiAxios.post("user/register", data);
            toast.push("Registration complete!");
            navigate("/");
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                if (error.response.status === 400) {
                    if (error.response.data.message === "validation error") {
                        toast.push(
                            `Invalid data supplied on : ${Object.keys(
                                error.response.data.errors
                            ).join(", ")}`
                        );
                    } else {
                        toast.push(error.response.data.message);
                    }
                } else {
                    toast.push(
                        error.response.data.message ||
                            `Unknown error with status ${error.response.status}`
                    );
                }
                return;
            }
            toast.push("Something went wrong when registering in");
        }
    };
</script>

<p class="text-xl text-center my-4">
    This is where you can signup. <a
        href="/"
        class="text-blue-600 hover:text-blue-300 hover:cursor-pointer"
        use:link>Back to main page</a
    >
</p>
<form class="max-w-2xl mx-auto" on:submit|preventDefault={handleRegister}>
    <div>
        <Label>Username - 3 characters minimal, only lowercase alphabet</Label>
        <Input
            type="text"
            id="username-input"
            class="max-w-2xl mx-auto"
            bind:value={$username.value}
        />
        <FieldValidationHelper field={username} />
    </div>

    <div>
        <Label class="mt-2"
            >Password - 8 characters minimal, alphanumeric uppercase/lowercase</Label
        >
        <Input
            type="password"
            id="password-input"
            class="max-w-2xl mx-auto"
            bind:value={$password.value}
        />
        <FieldValidationHelper field={password} />
    </div>

    <div>
        <Label class="mt-2">Confirm Password</Label>
        <Input
            type="password"
            id="confirm-password-input"
            class="max-w-2xl mx-auto"
            bind:value={$confirmPassword.value}
        />
        <FieldValidationHelper field={confirmPassword} />
    </div>

    <div>
        <Label class="mt-2"
            >Signup Code - 32 characters alphabet uppercase only</Label
        >
        <Input
            type="text"
            id="signupcode-input"
            class="max-w-2xl mx-auto"
            bind:value={$signupCode.value}
        />
        <FieldValidationHelper field={signupCode} />
    </div>
    <Button class="mt-2" type="submit">Signup</Button>
</form>
