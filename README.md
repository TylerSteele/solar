# Solar Community Enrollment 

![image](https://github.com/user-attachments/assets/2a753ddb-2117-42bb-9b07-698b96c9c4cf)


To view this app, you can either visit the [live page](https://solar-42q4-cdx14cju3-tyler-steeles-projects.vercel.app/) or install it locally.

## Getting Started

1. Create a local postgresql database.

2. Set up your python environment.
```bash
cd backend
conda create -n solar-backend python=3.11
conda activate solar-backend
pip install -r requirements.txt
```

3. Update the DATABASES value in settings.py to point to your local postgres database.
4. Set up the database.
```bash
python3 manage.py migrate
python3 manage.py load_utility_data
```
5. Run the server.
```
python3 manage.py runserver
```

6. Finally, run the frontend development server:

```bash
cd ../
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

## TODO

- Make the frontend more beautiful and reflect the brand
- Add validation (react-hook-form)
- Improve typing (tRPC, remove anys in updateData function)
- Allow backwards navigation to change prior pages
- Allow user to return mid flow (account creation? come-back-later link? local-storage)
- Add messaging / knock out scenarios for unsupported zip codes / state
- Auto-fill address as the user types
- Validate address automatically and offer replacing invalid address with suggestion
- Add at-rest encryption for PII fields
- Send confirmation email on completion (maybe require email confirmation during flow?)
- Update the copy to better explain why they should enroll
