import type { Route } from './+types/home';
import {
  DRUGS_LIST,
  IBUPROFENO_FACTOR,
  MAX_WEIGHT,
  MIN_WEIGHT,
  PARACETAMOL_FACTOR,
} from '~/configs/constants';
import { data, Form, useActionData } from 'react-router';
import { calculateDosage } from '~/services/engine';
import { logRequest, logResponse } from '../services/logger';
import { useEffect, useRef, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Xaropes App' },
    { name: 'description', content: 'An App to help calculate syrups dosages' },
  ];
}

export type SyrupResult = {
  mg: number;
  ml: number;
};

// export async function loader({ params }: Route.LoaderArgs) {}

export async function action({ request }: Route.ActionArgs) {
  // console.log('run on server');
  const formData = await request.formData();
  const drug = String(formData.get('xarope'));
  const weight = Number(formData.get('peso'));

  logRequest(
    'post',
    '/xaropes',
    JSON.stringify({
      peso: weight,
      xarope: drug,
    })
  );

  // validation
  const errors: Record<string, string> = {};

  if (!DRUGS_LIST.includes(drug)) {
    errors.drug = 'Selecção do xarope inválida';
  }

  if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
    errors.weight = `Peso deve estar entre ${MIN_WEIGHT} e ${MAX_WEIGHT}`;
  }

  if (Object.keys(errors).length > 0) {
    logResponse(400, 'BAD REQUEST', JSON.stringify(errors));
    return data({ errors }, { status: 400 });
  }

  // when valid -- do calculations
  const drugParts = drug.split('-');
  const drugName = drugParts[0];
  const drugConcentration = Number(drugParts[1]);
  const drugFactor =
    drugName === 'ibuprofeno' ? IBUPROFENO_FACTOR : PARACETAMOL_FACTOR;

  const resp = calculateDosage(drugFactor, drugConcentration, weight);
  logResponse(200, 'OK', JSON.stringify(resp));
  return resp;
}

export default function Home() {
  const title = 'xaropes.pt';
  const actionData = useActionData<any>();
  const [mg, setMg] = useState(0);
  const [ml, setMl] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const xaropeInputRef = useRef<HTMLInputElement>(null);

  const syrupOptions = [
    { label: 'Paracetamol 40', value: 'paracetamol-40' },
    { label: 'Ibuprofeno 20', value: 'ibuprofeno-20' },
    { label: 'Ibuprofeno 40', value: 'ibuprofeno-40' },
  ];

  useEffect(() => {
    if (actionData) {
      setMg(actionData.mg || 0);
      setMl(actionData.ml || 0);
    }
  }, [actionData]);

  const resetResults = () => {
    setMg(0);
    setMl(0);
  };

  const handleButtonClick = (value: string) => {
    setSelected(value);
    if (xaropeInputRef.current) {
      xaropeInputRef.current.value = value;
      resetResults();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-10">
        <div className="px-20 py-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>

            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </div>
      </header>
      <div className="flex h-screen">
        <div className="w-1/2 flex flex-col justify-center px-20">
          <div>
            <h2 className="text-center text-xl font-semibold mb-6">
              Calculadora de doses de xarope:
            </h2>
            <Form
              method="post"
              className="space-y-4 w-full max-w-full min-w-[50%] lg:max-w-[40%] mx-auto"
            >
              {/* selection */}
              <div className="flex gap-x-4">
                {syrupOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-1/3 rounded text-sm p-2 transition-colors cursor-pointer
                      ${
                        selected === option.value
                          ? 'bg-stone-100 text-black'
                          : 'bg-teal-700 text-white hover:bg-teal-800'
                      }
                    `}
                    onClick={() => handleButtonClick(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* selection */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="xarope"
                >
                  Xarope
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 cursor-not-allowed"
                  type="text"
                  id="xarope"
                  name="xarope"
                  ref={xaropeInputRef}
                  readOnly
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="peso"
                >
                  Peso
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2"
                  type="number"
                  id="peso"
                  name="peso"
                />
              </div>
              <button
                className="w-full bg-teal-700 text-white rounded py-2 cursor-pointer"
                type="submit"
              >
                Calcular
              </button>
              {/* error feedback */}

              {actionData?.errors && (
                <ul>
                  {Object.entries(actionData.errors).map(([field, message]) => (
                    <li className="text-orange-600" key={field}>
                      {String(message)}
                    </li>
                  ))}
                </ul>
              )}

              {/* resultado */}
              <h2 className="text-center text-xl font-semibold mb-6">
                Resultados:
              </h2>
              {/* mg */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="mg">
                  Mg
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 cursor-not-allowed"
                  type="number"
                  id="mg"
                  name="mg"
                  value={mg}
                  disabled
                />
              </div>
              {/* ml */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="ml">
                  Ml
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 cursor-not-allowed"
                  type="number"
                  id="ml"
                  name="ml"
                  value={ml}
                  disabled
                />
              </div>
            </Form>
          </div>
        </div>
        <div
          className="w-1/2 bg-cover"
          style={{ backgroundImage: "url('/image/kid-scale.png')" }}
        >
          {/* <div className="flex items-center justify-center h-full max-w-[50%] mx-auto"> */}
          <div className="flex items-end justify-center h-full max-w-[50%] mx-auto">
            <div className="bg-teal-600 text-white p-8 rounded shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>

                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
              <p className="text-4xl">
                Esta página é um trabalho académico. Consulte o seu médico ou
                enfermeiro, para validar os resultados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
