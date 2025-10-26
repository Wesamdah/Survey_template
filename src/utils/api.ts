import { Poll } from "@/store/pollStore";
import { headers } from "next/headers";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const URL = "https://poll-rs4it-test.rs-developing.com/";

export async function fetchPolls() {
  const AUTH_TOKEN = getAuthToken();
  try {
    const response = await fetch(`${URL}admin/poll`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Status: ${response.status}. Message: ${
          errorData.Message || "Failed Fetch Questions "
        }`
      );
    }

    const data = await response.json();

    const polls: Array<Poll> = data.data;

    return polls;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
}

interface SurveyPayload {
  pollId: number;
  profile: {
    full_name: string;
    email: string;
    phone: string;
    work_status: string;
    education: string;
    birth_date: string;
    address: string;
    gender: string;
  };
  answers: Array<{
    questionId: number;
    answerId: number;
  }>;
}

export async function submitSurvey(payload: SurveyPayload) {
  const AUTH_TOKEN = getAuthToken();
  try {
    const response = await fetch(`${URL}answer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();

      console.error("API Submission Error Details:", errorData);

      let errorMessage = `Submission failed! Status: ${response.status}.`;

      if (errorData.message) {
        errorMessage += ` Message: ${errorData.message}`;
      } else {
        errorMessage += ` Check console for full error details.`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Network or Submission Error:", error);
    throw error;
  }
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function handleLogin(payload: LoginPayload) {
  try {
    const response = await fetch(`${URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Login Error Details:", data);

      const errorMessage =
        data.message || data.error || "Failed to log in. Check credentials.";

      throw new Error(
        `Login failed! Status: ${response.status}. Message: ${errorMessage}`
      );
    }

    console.log("Login successful. Received data:", data);
    return data.accessToken as string;
  } catch (error) {
    console.error("Error during login process:", error);
    throw error;
  }
}

interface Permission {
  id: number;
  ar_name: string;
  code: String;
}

interface UserType {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface LoggedInUser {
  id: number;
  name: string;
  email: string;
  user_type: Array<UserType>;
}

export async function fetchCurrentUser(): Promise<LoggedInUser> {
  const AUTH_TOKEN = getAuthToken();

  if (!AUTH_TOKEN) {
    throw new Error("Authorization token is missing. Cannot fetch user info.");
  }

  try {
    const response = await fetch(`${URL}auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("API Fetch User Error Details:", data);
      const errorMessage =
        data.message || data.error || "Failed to fetch user data.";
      throw new Error(`Status: ${response.status}. Message: ${errorMessage}`);
    }

    console.log("Current User Data:", data);
    return data as LoggedInUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

interface AnswerPayload {
  text: string;
  points: number;
}

interface QuestionPayload {
  text: string;
  answers: AnswerPayload[];
}

export interface CreatePollPayload {
  title: string;
  description: string;
  questions: QuestionPayload[];
}

export async function createPoll(payload: CreatePollPayload): Promise<Poll> {
  const AUTH_TOKEN = getAuthToken();

  if (!AUTH_TOKEN) {
    throw new Error("Authorization token is missing. Cannot create poll.");
  }
  try {
    const response = await fetch(`${URL}admin/poll`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Create Poll Error Details:", data);
      const errorMessage =
        data.message || data.error || "Failed to create poll.";
      throw new Error(`Status: ${response.status}. Message: ${errorMessage}`);
    }

    console.log("Poll created successfully:", data);
    return data as Poll;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
}

export async function fetchPollDetails(pollId: number): Promise<Poll> {
  const AUTH_TOKEN = getAuthToken();

  if (!AUTH_TOKEN) {
    throw new Error("Authorization token is missing. Cannot create poll.");
  }

  try {
    const response = await fetch(`${URL}admin/poll/${pollId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("API Fetch Poll Details Error:", data);
      const errorMessage =
        data.message ||
        data.error ||
        `Failed to fetch details for poll ID ${pollId}.`;
      throw new Error(`Status: ${response.status}. Message: ${errorMessage}`);
    }

    return data as Poll;
  } catch (error) {
    console.error("Error fetching poll details:", error);
    throw error;
  }
}
