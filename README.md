# zdzislaw.dysza.app — aplikacja ZDZISŁAW

Aplikacja załogi Pracowni Sushi w dysza.app — wersja próbna („rura”): sprawdza drogę, którą pójdzie komunikator firmy.

- **Logowanie** — login z karty i PIN z manager.dysza.app (wspólne okno modułów dysza.app).
- **Ikona na ekranie** — iPhone i iPad: Safari → Udostępnij → „Do ekranu początkowego”; Android i komputer: „Zainstaluj aplikację”.
- **Powiadomienia** — „Włącz powiadomienia”, potem „Wyślij próbne powiadomienie”: urządzenie pokazuje powiadomienie
  i odsyła potwierdzenie, a aplikacja pokazuje, po ilu sekundach doszło. Na iPhonie i iPadzie powiadomienia działają
  po otwarciu aplikacji z ikony na ekranie (iOS i iPadOS 16.4 lub nowszy).

Dostęp nadaje kierownik w manager.dysza.app (moduł „ZDZISŁAW”, rola „Załoga”).

Strona nie zawiera żadnych danych. Po zalogowaniu dane przychodzą z funkcji bazy `zdzislaw_*`, które same pilnują dostępu.
Powiadomienia wysyła funkcja `zdzislaw-push` (Web Push); treść jest szyfrowana dla jednego urządzenia.

Wersja 2026-11-23 23:30 · 6487f14
