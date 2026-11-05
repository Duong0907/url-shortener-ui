// The parts of Google Identity Services that One Tap uses. The script loads at runtime.
interface Window {
  google?: {
    accounts: {
      id: {
        initialize(config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
          auto_select?: boolean;
          use_fedcm_for_prompt?: boolean;
          cancel_on_tap_outside?: boolean;
        }): void;
        prompt(): void;
        disableAutoSelect(): void;
      };
    };
  };
}
