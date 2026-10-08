<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep guest finance changes in memory only and restore sample data on refresh; this permits full exploration without retaining personal records.
- Open account sign-in and sign-up from the shared navigation dialog; account access must not replace the home screen.
- Keep appearance and in-app alert preferences in one shared browser-persisted provider; all preference controls must stay synchronized.
- Render Advisory at the index route and keep preferences on a dedicated Settings route; distinct content remains directly shareable.
- Pre-optimize the settings switch dependency and reject outdated optimized requests in Vite; open previews must not mix React module generations.
