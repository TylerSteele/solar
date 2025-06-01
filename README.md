# Solar Community Enrollment 

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

