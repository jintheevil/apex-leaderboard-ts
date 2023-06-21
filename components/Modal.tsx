'use client';

import {useRef} from "react";
import {supabase} from "@/lib/supabaseDatabase";

type Props = {
    modalType? : string,
    setModalType? : (newModal: string) => void
    modalText? : string,
    setLoadText? : (newText: string) => void
    loading? : boolean,
    setLoading? : (newLoading: boolean) => void
    leaders? : any[],
    setLeaders? : (newLeaders: any[]) => void
}

export default function ModalComponent({
    modalType,
    setModalType,
    modalText,
    setLoadText,
    loading,
    setLoading,
    leaders,
    setLeaders,
                                       }: Props) {
    // Modal reference
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal by clicking on background (If applicable)
    const handleClickOutside = (e: any) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            if (setLoading) {
                setLoading(false);
            }
        }
    };

    // Entry validation
    function validateEntry() {
        const name = (document.querySelector('#name') as HTMLInputElement).value;
        const score = (document.querySelector('#score') as HTMLInputElement).value;
        const fastestLapScore = (document.querySelector('#fastestLapScore') as HTMLInputElement).value;
        const overtakes = (document.querySelector('#overtakes') as HTMLInputElement).value;

        if (!name) {
            alert('Name can not be empty.')
            return false
        }

        if (!score) {
            alert('Score field can not be empty.')
            return false
        }

        if (!fastestLapScore) {
            alert('Fastest lap field can not be empty.')
            return false
        }

        if (!overtakes) {
            alert('Overtake field can not be empty.')
            return false
        }
    }

    // Function to add new entry to the database
    async function addEntry() {

        // End function if validation is not valid
        if (!validateEntry()) {
            return false
        }

        const name = (document.querySelector('#name') as HTMLInputElement).value;
        const score = (document.querySelector('#score') as HTMLInputElement).value;
        const fastestLapScore = (document.querySelector('#fastestLapScore') as HTMLInputElement).value;
        const overtakes = (document.querySelector('#overtakes') as HTMLInputElement).value;

        // Creating data body
        const data = {
            name,
            score,
            fastestLapScore,
            overtakes
        };

        // Set modal to load
        (setModalType) && setModalType('loading');
        (setLoadText) && setLoadText('Updating entries...');
        try {
            // Attempting to submit entry to API
            const response = await fetch('http://localhost:3000/api/results',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

            // Response if entry added into database
            // Set loading state
            if (response.ok) {
                (setLoading) && setLoading(false);
                alert('Entry successfully added to the database.');
            }
        } catch (err) {
            // Log and alert an error back to the user
            // Set loading state
            console.log(err);
            (setLoading) && setLoading(false);
            alert('Error occurred. Please try again.');
        }
    }

    // Function to generate leaderboard according to config
    async function generateLeaderboard() {
        const scoreCalculation = (document.querySelector('#scoreCalculation') as HTMLInputElement).value;
        const lapCalculation = (document.querySelector('#lapCalculation') as HTMLInputElement).value;
        const overtakeCalculation = (document.querySelector('#overtakeCalculation') as HTMLInputElement).value;
        const scoreOrder = (document.querySelector('#scoreOrder') as HTMLInputElement).value;
        const lapOrder = (document.querySelector('#lapOrder') as HTMLInputElement).value;
        const overtakeOrder = (document.querySelector('#overtakeOrder') as HTMLInputElement).value;

        // Creating data body for config
        const data = [
            {
                field: 'score',
                operation: scoreCalculation,
                order: scoreOrder,
            },
            {
                field: 'fastestLapScore',
                operation: lapCalculation,
                order: lapOrder,
            },
            {
                field: 'overtakes',
                operation: overtakeCalculation,
                order: overtakeOrder,
            },
        ];

        // Set modal to load
        (setModalType) && setModalType('loading');
        (setLoadText) && setLoadText('Generating leaderboard...');
        try {
            // Attempting to generate leaderboard according to config
            const response = await fetch('http://localhost:3000/api/leaderboard',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
            })

            // Set leaderboard and loading state if response is good
            if (response.ok) {
                const results = await response.json();

                console.log(results.data);
                (setLeaders) && setLeaders(results.data);
                (setLoading) && setLoading(false);
                alert('Leaderboard generated!');
            }
        } catch (err) {
            console.log(err);
            (setLoading) && setLoading(false);
            alert('Error occurred. Please try again.');
        }
    }

    if (modalType === 'loading') {
        return (
            <div className={'absolute top-0 left-0 bg-gray-700 bg-opacity-60 h-[100vh] w-[100vw] grid place-items-center'}>
                <div ref={modalRef}  className={'p-4 rounded-xl bg-black text-white'}>
                    { modalText }
                </div>
            </div>
        )
    }
    if (modalType === 'entry' ) {

        return (
            <div>
                <div className={'absolute top-0 left-0 bg-gray-700 bg-opacity-60 h-[100vh] w-[100vw] grid place-items-center'} onClick={handleClickOutside}>
                    <div ref={modalRef} className={'p-12 rounded-xl bg-black grid grid-cols-2 gap-4'}>
                        <h4 className={ 'col-span-2 text-3xl mb-2' }>Data Entry</h4>
                        <label>Name: </label>
                        <input className={ 'px-2 rounded-xl text-black' } type={ 'text' } id={ 'name' }/>
                        <label>Score: </label>
                        <input className={ 'px-2 rounded-xl text-black' } type={ 'number' } id={ 'score' }/>
                        <label>Fastest Lap Score: </label>
                        <input className={ 'px-2 rounded-xl text-black' } type={ 'number' } id={ 'fastestLapScore' }/>
                        <label>Overtakes: </label>
                        <input className={ 'px-2 rounded-xl text-black' } type={ 'number' } id={ 'overtakes' }/>
                        <button className={ 'col-span-2 p-1 bg-green-600 text-white rounded-2xl' } onClick={ () => addEntry() } type={ 'button' }>Submit</button>
                    </div>
                </div>
            </div>
        )
    }

    if (modalType === 'config') {
        return (
            <div>
                <div className={'absolute top-0 left-0 bg-gray-700 bg-opacity-60 h-[100vh] w-[100vw] grid place-items-center'} onClick={handleClickOutside}>
                    <div ref={modalRef} className={'p-12 rounded-xl bg-black grid grid-cols-3 gap-4'}>
                        <h4 className={ 'col-span-3 text-3xl mb-2' }>Config</h4>
                        <label>Criteria</label>
                        <label>Calculation</label>
                        <label>Order</label>
                        <label>Score: </label>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'scoreCalculation' }>
                            <option value="sum">Sum</option>
                            <option value="min">Min</option>
                            <option value="max">Max</option>
                        </select>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'scoreOrder' }>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <label>Scored Fastest Lap: </label>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'lapCalculation' }>
                            <option value="sum">Sum</option>
                            <option value="min">Min</option>
                            <option value="max">Max</option>
                        </select>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'lapOrder' }>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <label>Overtaken: </label>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'overtakeCalculation' }>
                            <option value="sum">Sum</option>
                            <option value="min">Min</option>
                            <option value="max">Max</option>
                        </select>
                        <select className={ 'px-2 rounded-xl text-black' } id={ 'overtakeOrder' }>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <button className={ 'col-span-3 p-1 bg-green-600 text-white rounded-2xl mx-20' } onClick={ () => generateLeaderboard() } type={ 'button' }>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}
