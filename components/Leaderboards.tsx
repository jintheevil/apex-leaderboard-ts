type Props = {
    leaders: any[]
}

export default function LeaderboardComponent({
    leaders,
                                             }: Props) {
    return (
        <div>
            <div className={ 'w-full grid grid-cols-5 mt-4'}>
                <div className={ 'w-full border-2 border-white grid place-items-center'}>Rank:</div>
                <div className={ 'w-full border-2 border-white grid place-items-center'}>Name:</div>
                <div className={ 'w-full border-2 border-white grid place-items-center'}>Score:</div>
                <div className={ 'w-full border-2 border-white grid place-items-center'}>Fastest Lap Score:</div>
                <div className={ 'w-full border-2 border-white grid place-items-center'}>Overtakes:</div>
            </div>
            {
                leaders.map((leader, index) => {
                    return (
                        <div key={ leader.id } className={ 'w-full grid grid-cols-5'}>
                            <div className={ 'w-full border-2 border-white grid place-items-center'}>{ index + 1 }</div>
                            <div className={ 'w-full border-2 border-white grid place-items-center'}>{ leader.name }</div>
                            <div className={ 'w-full border-2 border-white grid place-items-center'}>{ leader.score }</div>
                            <div className={ 'w-full border-2 border-white grid place-items-center'}>{ leader.fastestLapScore }</div>
                            <div className={ 'w-full border-2 border-white grid place-items-center'}>{ leader.overtakes }</div>
                        </div>
                    )
                })
            }
        </div>
    )
}